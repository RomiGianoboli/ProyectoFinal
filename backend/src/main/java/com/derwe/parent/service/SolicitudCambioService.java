package com.derwe.parent.service;

import com.derwe.parent.dto.request.SolicitudCambioRequestDTO;
import com.derwe.parent.dto.response.SolicitudCambioResponseDTO;
import com.derwe.parent.model.*;
import com.derwe.parent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudCambioService {
    
    private final SolicitudCambioRepository solicitudCambioRepository;
    private final HijoRepository hijoRepository;
    private final PadreRepository padreRepository;
    private final RelacionPadreHijoRepository relacionRepository;
    private final NotificacionService notificacionService;
    
    @Transactional
    public SolicitudCambioResponseDTO crearSolicitudCambio(Long padreId, SolicitudCambioRequestDTO request) {
        // Validar padre e hijo
        Padre padreSolicitante = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        Hijo hijo = hijoRepository.findById(request.getHijoId())
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        // Validar relación
        if (!relacionRepository.existsByPadreIdAndHijoId(padreId, request.getHijoId())) {
            throw new RuntimeException("No tienes acceso a este hijo");
        }
        
        // Validar fechas
        if (request.getFechaHasta().isBefore(request.getFechaDesde())) {
            throw new RuntimeException("La fecha hasta debe ser posterior a la fecha desde");
        }
        
        // Obtener co-padre
        Padre padreReceptor = relacionRepository.findByHijoId(hijo.getId()).stream()
            .filter(r -> !r.getPadre().getId().equals(padreId))
            .map(RelacionPadreHijo::getPadre)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Co-padre no encontrado"));
        
        // Crear solicitud
        SolicitudCambio solicitud = new SolicitudCambio();
        solicitud.setHijo(hijo);
        solicitud.setPadreSolicitante(padreSolicitante);
        solicitud.setPadreReceptor(padreReceptor);
        solicitud.setFechaDesde(request.getFechaDesde());
        solicitud.setFechaHasta(request.getFechaHasta());
        solicitud.setMotivo(request.getMotivo());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        
        SolicitudCambio solicitudGuardada = solicitudCambioRepository.save(solicitud);
        
        // Notificar al padre receptor
        notificacionService.crearNotificacion(
            padreReceptor.getId(),
            TipoNotificacion.SOLICITUD_CAMBIO_CUSTODIA,
            solicitudGuardada.getId(),
            "Nueva solicitud de cambio de custodia del " + 
            request.getFechaDesde() + " al " + request.getFechaHasta()
        );
        
        return convertirAResponseDTO(solicitudGuardada);
    }
    
    @Transactional
    public SolicitudCambioResponseDTO aprobarSolicitud(Long solicitudId, Long padreId) {
        SolicitudCambio solicitud = solicitudCambioRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        // Validar que sea el padre receptor
        if (!solicitud.getPadreReceptor().getId().equals(padreId)) {
            throw new RuntimeException("No tienes permiso para aprobar esta solicitud");
        }
        
        // Validar estado
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }
        
        // Aprobar
        solicitud.setEstado(EstadoSolicitud.APROBADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        
        SolicitudCambio solicitudActualizada = solicitudCambioRepository.save(solicitud);
        
        // Notificar al solicitante
        notificacionService.crearNotificacion(
            solicitud.getPadreSolicitante().getId(),
            TipoNotificacion.SOLICITUD_APROBADA,
            solicitudId,
            "Tu solicitud de cambio de custodia fue aprobada"
        );
        
        return convertirAResponseDTO(solicitudActualizada);
    }
    
    @Transactional
    public SolicitudCambioResponseDTO rechazarSolicitud(Long solicitudId, Long padreId) {
        SolicitudCambio solicitud = solicitudCambioRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        // Validar que sea el padre receptor
        if (!solicitud.getPadreReceptor().getId().equals(padreId)) {
            throw new RuntimeException("No tienes permiso para rechazar esta solicitud");
        }
        
        // Validar estado
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }
        
        // Rechazar
        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        
        SolicitudCambio solicitudActualizada = solicitudCambioRepository.save(solicitud);
        
        // Notificar al solicitante
        notificacionService.crearNotificacion(
            solicitud.getPadreSolicitante().getId(),
            TipoNotificacion.SOLICITUD_RECHAZADA,
            solicitudId,
            "Tu solicitud de cambio de custodia fue rechazada"
        );
        
        return convertirAResponseDTO(solicitudActualizada);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudCambioResponseDTO> obtenerSolicitudesEnviadas(Long padreId) {
        return solicitudCambioRepository.findByPadreSolicitanteId(padreId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudCambioResponseDTO> obtenerSolicitudesRecibidas(Long padreId) {
        return solicitudCambioRepository.findByPadreReceptorId(padreId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudCambioResponseDTO> obtenerSolicitudesPorEstado(Long padreId, EstadoSolicitud estado) {
        return solicitudCambioRepository.findByPadreSolicitanteIdAndEstado(padreId, estado).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    private SolicitudCambioResponseDTO convertirAResponseDTO(SolicitudCambio solicitud) {
        SolicitudCambioResponseDTO dto = new SolicitudCambioResponseDTO();
        dto.setId(solicitud.getId());
        dto.setHijoId(solicitud.getHijo().getId());
        dto.setNombreHijo(solicitud.getHijo().getNombre() + " " + solicitud.getHijo().getApellido());
        dto.setFechaDesde(solicitud.getFechaDesde());
        dto.setFechaHasta(solicitud.getFechaHasta());
        dto.setEstado(solicitud.getEstado().name());
        dto.setMotivo(solicitud.getMotivo());
        dto.setPadreSolicitanteId(solicitud.getPadreSolicitante().getId());
        dto.setNombrePadreSolicitante(
            solicitud.getPadreSolicitante().getNombre() + " " +
            solicitud.getPadreSolicitante().getApellido()
        );
        dto.setPadreReceptorId(solicitud.getPadreReceptor().getId());
        dto.setNombrePadreReceptor(
            solicitud.getPadreReceptor().getNombre() + " " +
            solicitud.getPadreReceptor().getApellido()
        );
        dto.setFechaSolicitud(solicitud.getFechaSolicitud());
        dto.setFechaResolucion(solicitud.getFechaResolucion());
        return dto;
    }
}
