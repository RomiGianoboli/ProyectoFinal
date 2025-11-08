package com.derwe.parent.service;

import com.derwe.parent.dto.response.NotificacionResponseDTO;
import com.derwe.parent.model.Notificacion;
import com.derwe.parent.model.Padre;
import com.derwe.parent.model.TipoNotificacion;
import com.derwe.parent.repository.NotificacionRepository;
import com.derwe.parent.repository.PadreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificacionService {
    
    private final NotificacionRepository notificacionRepository;
    private final PadreRepository padreRepository;
    
    @Transactional
    public NotificacionResponseDTO crearNotificacion(Long padreId, TipoNotificacion tipo, 
                                                      Long referenciaId, String mensaje) {
        Padre padre = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        Notificacion notificacion = new Notificacion();
        notificacion.setPadreDestinatario(padre);
        notificacion.setTipo(tipo);
        notificacion.setReferenciaId(referenciaId);
        notificacion.setMensaje(mensaje);
        notificacion.setLeida(false);
        
        Notificacion notificacionGuardada = notificacionRepository.save(notificacion);
        
        return convertirAResponseDTO(notificacionGuardada);
    }
    
    @Transactional
    public NotificacionResponseDTO marcarComoLeida(Long notificacionId, Long padreId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
            .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        
        // Validar que la notificación pertenezca al padre
        if (!notificacion.getPadreDestinatario().getId().equals(padreId)) {
            throw new RuntimeException("No tienes acceso a esta notificación");
        }
        
        notificacion.setLeida(true);
        notificacion.setFechaLectura(LocalDateTime.now());
        
        Notificacion notificacionActualizada = notificacionRepository.save(notificacion);
        
        return convertirAResponseDTO(notificacionActualizada);
    }
    
    @Transactional
    public void marcarTodasComoLeidas(Long padreId) {
        List<Notificacion> notificaciones = notificacionRepository.findByPadreDestinatarioIdAndLeida(padreId, false);
        
        notificaciones.forEach(n -> {
            n.setLeida(true);
            n.setFechaLectura(LocalDateTime.now());
        });
        
        notificacionRepository.saveAll(notificaciones);
    }
    
    @Transactional(readOnly = true)
    public List<NotificacionResponseDTO> obtenerNotificacionesPorPadre(Long padreId) {
        return notificacionRepository.findByPadreDestinatarioIdOrderByFechaCreacionDesc(padreId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<NotificacionResponseDTO> obtenerNotificacionesNoLeidas(Long padreId) {
        return notificacionRepository.findByPadreDestinatarioIdAndLeida(padreId, false).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Long contarNotificacionesNoLeidas(Long padreId) {
        return notificacionRepository.countNoLeidasByPadreId(padreId);
    }
    
    @Transactional
    public void eliminarNotificacion(Long notificacionId, Long padreId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
            .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        
        // Validar que la notificación pertenezca al padre
        if (!notificacion.getPadreDestinatario().getId().equals(padreId)) {
            throw new RuntimeException("No tienes acceso a esta notificación");
        }
        
        notificacionRepository.delete(notificacion);
    }
    
    private NotificacionResponseDTO convertirAResponseDTO(Notificacion notificacion) {
        NotificacionResponseDTO dto = new NotificacionResponseDTO();
        dto.setId(notificacion.getId());
        dto.setTipo(notificacion.getTipo().name());
        dto.setReferenciaId(notificacion.getReferenciaId());
        dto.setMensaje(notificacion.getMensaje());
        dto.setLeida(notificacion.getLeida());
        dto.setFechaCreacion(notificacion.getFechaCreacion());
        dto.setFechaLectura(notificacion.getFechaLectura());
        return dto;
    }
}
