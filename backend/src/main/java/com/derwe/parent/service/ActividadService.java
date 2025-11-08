package com.derwe.parent.service;

import com.derwe.parent.dto.request.ActividadRequestDTO;
import com.derwe.parent.dto.response.ActividadResponseDTO;
import com.derwe.parent.model.*;
import com.derwe.parent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActividadService {
    
    private final ActividadRepository actividadRepository;
    private final HijoRepository hijoRepository;
    private final PadreRepository padreRepository;
    private final RelacionPadreHijoRepository relacionRepository;
    private final NotificacionService notificacionService;
    
    @Transactional
    public ActividadResponseDTO crearActividad(Long padreId, ActividadRequestDTO request) {
        Padre padre = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        Hijo hijo = hijoRepository.findById(request.getHijoId())
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        if (!relacionRepository.existsByPadreIdAndHijoId(padreId, request.getHijoId())) {
            throw new RuntimeException("No tienes acceso a este hijo");
        }
        
        if (request.getHoraFin().isBefore(request.getHoraInicio())) {
            throw new RuntimeException("La hora de fin debe ser posterior a la hora de inicio");
        }
        
        Actividad actividad = new Actividad();
        actividad.setHijo(hijo);
        actividad.setPadreCreador(padre);
        actividad.setFecha(request.getFecha());
        actividad.setHoraInicio(request.getHoraInicio());
        actividad.setHoraFin(request.getHoraFin());
        actividad.setNombre(request.getNombre());
        actividad.setDescripcion(request.getDescripcion());
        actividad.setEstado(EstadoActividad.CONFIRMADA);
        
        Actividad actividadGuardada = actividadRepository.save(actividad);
        
        notificarCoPadre(hijo.getId(), padreId, TipoNotificacion.ACTIVIDAD_CREADA, 
            actividadGuardada.getId(), "Nueva actividad creada: " + actividad.getNombre());
        
        return convertirAResponseDTO(actividadGuardada, padreId);
    }
    
    @Transactional
    public ActividadResponseDTO editarActividad(Long actividadId, Long padreId, ActividadRequestDTO request) {
        Actividad actividad = actividadRepository.findById(actividadId)
            .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));
        
        Padre padre = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        boolean esPadreCreador = actividad.getPadreCreador().getId().equals(padreId);
        
        actividad.setFecha(request.getFecha());
        actividad.setHoraInicio(request.getHoraInicio());
        actividad.setHoraFin(request.getHoraFin());
        actividad.setNombre(request.getNombre());
        actividad.setDescripcion(request.getDescripcion());
        
        if (!esPadreCreador) {
            actividad.setEstado(EstadoActividad.PENDIENTE_APROBACION);
            actividad.setPadreModificador(padre);
            
            notificacionService.crearNotificacion(
                actividad.getPadreCreador().getId(),
                TipoNotificacion.ACTIVIDAD_PENDIENTE_APROBACION,
                actividadId,
                "El co-padre modificó la actividad: " + actividad.getNombre()
            );
        } else {
            actividad.setEstado(EstadoActividad.CONFIRMADA);
        }
        
        Actividad actividadActualizada = actividadRepository.save(actividad);
        
        return convertirAResponseDTO(actividadActualizada, padreId);
    }
    
    @Transactional
    public void eliminarActividad(Long actividadId, Long padreId) {
        Actividad actividad = actividadRepository.findById(actividadId)
            .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));
        
        notificarCoPadre(actividad.getHijo().getId(), padreId, 
            TipoNotificacion.ACTIVIDAD_ELIMINADA, actividadId,
            "Actividad eliminada: " + actividad.getNombre());
        
        actividadRepository.delete(actividad);
    }
    
    @Transactional(readOnly = true)
    public List<ActividadResponseDTO> obtenerActividadesPorHijoYFecha(Long hijoId, LocalDate fecha, Long padreId) {
        return actividadRepository.findByHijoIdAndFecha(hijoId, fecha).stream()
            .map(actividad -> convertirAResponseDTO(actividad, padreId))
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ActividadResponseDTO> obtenerActividadesPorHijoYMes(Long hijoId, int anio, int mes, Long padreId) {
        LocalDate fechaInicio = LocalDate.of(anio, mes, 1);
        LocalDate fechaFin = fechaInicio.plusMonths(1).minusDays(1);
        
        return actividadRepository.findByHijoIdAndFechaBetween(hijoId, fechaInicio, fechaFin).stream()
            .map(actividad -> convertirAResponseDTO(actividad, padreId))
            .collect(Collectors.toList());
    }
    
    private void notificarCoPadre(Long hijoId, Long padreActualId, TipoNotificacion tipo, 
                                   Long referenciaId, String mensaje) {
        relacionRepository.findByHijoId(hijoId).stream()
            .filter(r -> !r.getPadre().getId().equals(padreActualId))
            .forEach(r -> notificacionService.crearNotificacion(
                r.getPadre().getId(), tipo, referenciaId, mensaje
            ));
    }
    
    private ActividadResponseDTO convertirAResponseDTO(Actividad actividad, Long padreId) {
        ActividadResponseDTO dto = new ActividadResponseDTO();
        dto.setId(actividad.getId());
        dto.setHijoId(actividad.getHijo().getId());
        dto.setNombreHijo(actividad.getHijo().getNombre() + " " + actividad.getHijo().getApellido());
        dto.setFecha(actividad.getFecha());
        dto.setHoraInicio(actividad.getHoraInicio());
        dto.setHoraFin(actividad.getHoraFin());
        dto.setNombre(actividad.getNombre());
        dto.setDescripcion(actividad.getDescripcion());
        dto.setEstado(actividad.getEstado().name());
        dto.setPadreCreadorId(actividad.getPadreCreador().getId());
        dto.setNombrePadreCreador(actividad.getPadreCreador().getNombre());
        
        relacionRepository.findByPadreIdAndHijoId(
            actividad.getPadreCreador().getId(), 
            actividad.getHijo().getId()
        ).ifPresent(r -> dto.setColorCreador(r.getColorAsignado()));
        
        dto.setPuedeEditar(actividad.getPadreCreador().getId().equals(padreId));
        
        return dto;
    }
}
