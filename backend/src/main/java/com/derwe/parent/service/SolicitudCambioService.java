package com.derwe.parent.service;

import com.derwe.parent.dto.request.SolicitudCambioRequestDTO;
import com.derwe.parent.dto.response.SolicitudCambioResponseDTO;
import com.derwe.parent.model.*;
import com.derwe.parent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudCambioService {
    
    private final SolicitudCambioRepository solicitudCambioRepository;
    private final FechaCustodiaRepository fechaCustodiaRepository;
    private final HijoRepository hijoRepository;
    private final PadreRepository padreRepository;
    private final RelacionPadreHijoRepository relacionRepository;
    private final NotificacionService notificacionService;
    
    @Transactional
    public SolicitudCambioResponseDTO crearSolicitudCambio(Long padreId, SolicitudCambioRequestDTO request) {
        Padre padreSolicitante = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        Hijo hijo = hijoRepository.findById(request.getHijoId())
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        if (!relacionRepository.existsByPadreIdAndHijoId(padreId, request.getHijoId())) {
            throw new RuntimeException("No tienes acceso a este hijo");
        }
        
        if (request.getFechaHasta().isBefore(request.getFechaDesde())) {
            throw new RuntimeException("La fecha hasta debe ser posterior a la fecha desde");
        }
        
        TipoSolicitudCustodia tipoSolicitud = TipoSolicitudCustodia.valueOf(request.getTipoSolicitud());
        
        if (tipoSolicitud == TipoSolicitudCustodia.ESTABLECER) {
            List<LocalDate> fechasOcupadas = verificarFechasOcupadas(
                hijo.getId(), 
                request.getFechaDesde(), 
                request.getFechaHasta()
            );
            
            if (!fechasOcupadas.isEmpty()) {
                throw new RuntimeException("Las siguientes fechas ya están ocupadas: " + 
                    fechasOcupadas.stream()
                        .map(LocalDate::toString)
                        .collect(Collectors.joining(", ")));
            }
        }
        
        Padre padreReceptor = relacionRepository.findByHijoId(hijo.getId()).stream()
            .filter(r -> !r.getPadre().getId().equals(padreId))
            .map(RelacionPadreHijo::getPadre)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Co-padre no encontrado"));
        
        SolicitudCambio solicitud = new SolicitudCambio();
        solicitud.setHijo(hijo);
        solicitud.setPadreSolicitante(padreSolicitante);
        solicitud.setPadreReceptor(padreReceptor);
        solicitud.setFechaDesde(request.getFechaDesde());
        solicitud.setFechaHasta(request.getFechaHasta());
        solicitud.setTipoSolicitud(tipoSolicitud);
        solicitud.setMotivo(request.getMotivo());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        
        SolicitudCambio solicitudGuardada = solicitudCambioRepository.save(solicitud);
        
        String tipoTexto = tipoSolicitud == TipoSolicitudCustodia.ESTABLECER 
            ? "establecer fechas de custodia" 
            : "cambio de fechas de custodia";
        
        notificacionService.crearNotificacion(
            padreReceptor.getId(),
            TipoNotificacion.SOLICITUD_CAMBIO_CUSTODIA,
            solicitudGuardada.getId(),
            padreSolicitante.getNombre() + " " + padreSolicitante.getApellido() + 
            " solicita " + tipoTexto + " del " + 
            request.getFechaDesde() + " al " + request.getFechaHasta()
        );
        
        return convertirAResponseDTO(solicitudGuardada);
    }
    
    private List<LocalDate> verificarFechasOcupadas(Long hijoId, LocalDate fechaDesde, LocalDate fechaHasta) {
        List<LocalDate> fechasOcupadas = new ArrayList<>();
        
        List<FechaCustodia> custodiasExistentes = fechaCustodiaRepository
            .findByHijoIdAndFechaBetween(hijoId, fechaDesde, fechaHasta);
        
        for (FechaCustodia custodia : custodiasExistentes) {
            if (custodia.getEstado() == EstadoCustodia.CONFIRMADA) {
                fechasOcupadas.add(custodia.getFecha());
            }
        }
        
        return fechasOcupadas;
    }
    
    @Transactional
    public SolicitudCambioResponseDTO aprobarSolicitud(Long solicitudId, Long padreId) {
        SolicitudCambio solicitud = solicitudCambioRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        if (!solicitud.getPadreReceptor().getId().equals(padreId)) {
            throw new RuntimeException("No tienes permiso para aprobar esta solicitud");
        }
        
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }
        
        solicitud.setEstado(EstadoSolicitud.APROBADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        
        SolicitudCambio solicitudActualizada = solicitudCambioRepository.save(solicitud);
        
        crearFechasCustodia(solicitud);
        
        Padre padreReceptor = solicitud.getPadreReceptor();
        String nombreCompleto = padreReceptor.getNombre() + " " + padreReceptor.getApellido();
        
        notificacionService.crearNotificacion(
            solicitud.getPadreSolicitante().getId(),
            TipoNotificacion.CAMBIO_CUSTODIA_APROBADO,
            solicitudId,
            nombreCompleto + " ha aprobado las fechas seleccionadas del " + 
            solicitud.getFechaDesde() + " al " + solicitud.getFechaHasta()
        );
        
        return convertirAResponseDTO(solicitudActualizada);
    }
    
    private void crearFechasCustodia(SolicitudCambio solicitud) {
        LocalDate fechaActual = solicitud.getFechaDesde();
        
        while (!fechaActual.isAfter(solicitud.getFechaHasta())) {
            fechaCustodiaRepository.findByHijoIdAndFecha(
                solicitud.getHijo().getId(), 
                fechaActual
            ).ifPresent(fechaCustodiaRepository::delete);
            
            FechaCustodia nuevaFecha = new FechaCustodia();
            nuevaFecha.setHijo(solicitud.getHijo());
            nuevaFecha.setPadreResponsable(solicitud.getPadreSolicitante());
            nuevaFecha.setFecha(fechaActual);
            nuevaFecha.setEstado(EstadoCustodia.CONFIRMADA);
            nuevaFecha.setTipoCustodia("DIA_COMPLETO");
            
            fechaCustodiaRepository.save(nuevaFecha);
            
            fechaActual = fechaActual.plusDays(1);
        }
    }
    
    @Transactional
    public SolicitudCambioResponseDTO rechazarSolicitud(Long solicitudId, Long padreId) {
        SolicitudCambio solicitud = solicitudCambioRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        if (!solicitud.getPadreReceptor().getId().equals(padreId)) {
            throw new RuntimeException("No tienes permiso para rechazar esta solicitud");
        }
        
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }
        
        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        
        SolicitudCambio solicitudActualizada = solicitudCambioRepository.save(solicitud);
        
        Padre padreReceptor = solicitud.getPadreReceptor();
        String nombreCompleto = padreReceptor.getNombre() + " " + padreReceptor.getApellido();
        
        notificacionService.crearNotificacion(
            solicitud.getPadreSolicitante().getId(),
            TipoNotificacion.CAMBIO_CUSTODIA_RECHAZADO,
            solicitudId,
            nombreCompleto + " ha rechazado las fechas seleccionadas del " + 
            solicitud.getFechaDesde() + " al " + solicitud.getFechaHasta()
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
    public List<SolicitudCambioResponseDTO> obtenerSolicitudesPendientes(Long padreId) {
        return solicitudCambioRepository.findByPadreReceptorIdAndEstado(padreId, EstadoSolicitud.PENDIENTE).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudCambioResponseDTO> obtenerSolicitudesPorEstado(Long padreId, EstadoSolicitud estado) {
        return solicitudCambioRepository.findByPadreReceptorIdAndEstado(padreId, estado).stream()
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
        dto.setTipoSolicitud(solicitud.getTipoSolicitud().name());
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
