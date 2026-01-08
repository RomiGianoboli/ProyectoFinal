package com.derwe.parent.service;

import com.derwe.parent.dto.request.HijoRequestDTO;
import com.derwe.parent.dto.response.HijoResponseDTO;
import com.derwe.parent.dto.response.SeleccionColorResponseDTO;
import com.derwe.parent.model.Hijo;
import com.derwe.parent.model.Padre;
import com.derwe.parent.model.RelacionPadreHijo;
import com.derwe.parent.repository.HijoRepository;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.repository.RelacionPadreHijoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HijoService {
    
    private final HijoRepository hijoRepository;
    private final PadreRepository padreRepository;
    private final RelacionPadreHijoRepository relacionRepository;
    
    @Transactional
    public HijoResponseDTO registrarHijo(Long padreId, HijoRequestDTO request) {
        Padre padre = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        Padre coPadre = buscarCoPadreVinculado(padreId);
        
        Hijo hijo = new Hijo();
        hijo.setNombre(request.getNombre());
        hijo.setApellido(request.getApellido());
        hijo.setFechaNacimiento(request.getFechaNacimiento());
        
        Hijo hijoGuardado = hijoRepository.save(hijo);
        
        RelacionPadreHijo relacion = new RelacionPadreHijo();
        relacion.setPadre(padre);
        relacion.setHijo(hijoGuardado);
        relacion.setEsPadreCreador(true);
        relacion.setColorAsignado(null);
        
        relacionRepository.save(relacion);
        
        if (coPadre != null) {
            RelacionPadreHijo relacionCoPadre = new RelacionPadreHijo();
            relacionCoPadre.setPadre(coPadre);
            relacionCoPadre.setHijo(hijoGuardado);
            relacionCoPadre.setEsPadreCreador(false);
            relacionCoPadre.setColorAsignado(null);
            relacionRepository.save(relacionCoPadre);
        }
        
        return convertirAResponseDTO(hijoGuardado, padreId);
    }
    
    private Padre buscarCoPadreVinculado(Long padreId) {
        List<RelacionPadreHijo> relacionesPadre = relacionRepository.findByPadreId(padreId);
        
        if (relacionesPadre.isEmpty()) {
            return null;
        }
        
        Padre coPadreUnico = null;
        
        for (RelacionPadreHijo relacion : relacionesPadre) {
            List<RelacionPadreHijo> relacionesHijo = relacionRepository.findByHijoId(relacion.getHijo().getId());
            
            Padre coPadreDelHijo = null;
            for (RelacionPadreHijo relacionHijo : relacionesHijo) {
                if (!relacionHijo.getPadre().getId().equals(padreId)) {
                    coPadreDelHijo = relacionHijo.getPadre();
                    break;
                }
            }
            
            if (coPadreDelHijo == null) {
                return null;
            }
            
            if (coPadreUnico == null) {
                coPadreUnico = coPadreDelHijo;
            } else if (!coPadreUnico.getId().equals(coPadreDelHijo.getId())) {
                return null;
            }
        }
        
        return coPadreUnico;
    }
    
    @Transactional
    public void vincularHijoConCoPadre(Long hijoId, Long coPadreId) {
        Hijo hijo = hijoRepository.findById(hijoId)
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        Padre coPadre = padreRepository.findById(coPadreId)
            .orElseThrow(() -> new RuntimeException("Co-padre no encontrado"));
        
        if (relacionRepository.existsByPadreIdAndHijoId(coPadreId, hijoId)) {
            throw new RuntimeException("El co-padre ya está vinculado con este hijo");
        }
        
        RelacionPadreHijo relacion = new RelacionPadreHijo();
        relacion.setPadre(coPadre);
        relacion.setHijo(hijo);
        relacion.setEsPadreCreador(false);
        relacion.setColorAsignado(null); // Color NULL hasta que el co-padre lo seleccione en el calendario
        
        relacionRepository.save(relacion);
    }
    
    @Transactional(readOnly = true)
    public List<HijoResponseDTO> obtenerHijosPorPadre(Long padreId) {
        return hijoRepository.findByPadreId(padreId).stream()
            .map(hijo -> convertirAResponseDTO(hijo, padreId))
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public HijoResponseDTO obtenerHijoPorId(Long hijoId, Long padreId) {
        Hijo hijo = hijoRepository.findById(hijoId)
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        if (!relacionRepository.existsByPadreIdAndHijoId(padreId, hijoId)) {
            throw new RuntimeException("No tienes acceso a este hijo");
        }
        
        return convertirAResponseDTO(hijo, padreId);
    }
    
    @Transactional
    public SeleccionColorResponseDTO seleccionarColor(Long hijoId, Long padreId, String colorElegido) {
        // Verificar que la relación existe
        RelacionPadreHijo relacionPadre = relacionRepository.findByPadreIdAndHijoId(padreId, hijoId)
                .orElseThrow(() -> new RuntimeException("No tienes acceso a este hijo"));
        
        // Obtener todas las relaciones para este hijo
        List<RelacionPadreHijo> todasRelaciones = relacionRepository.findByHijoId(hijoId);
        
        // Verificar si CUALQUIER padre ya tiene color asignado (no solo el que llama)
        for (RelacionPadreHijo relacion : todasRelaciones) {
            if (relacion.getColorAsignado() != null) {
                // Ya hay un color asignado - no se puede cambiar
                if (relacion.getPadre().getId().equals(padreId)) {
                    throw new RuntimeException("El color ya fue seleccionado y no se puede cambiar");
                } else {
                    // El co-padre ya eligió, este padre tiene el color opuesto automáticamente
                    String colorAsignadoAutomatico = "LILA".equals(relacion.getColorAsignado()) ? "CELESTE" : "LILA";
                    if (relacionPadre.getColorAsignado() == null) {
                        relacionPadre.setColorAsignado(colorAsignadoAutomatico);
                        relacionRepository.save(relacionPadre);
                    }
                    throw new RuntimeException("El co-padre ya seleccionó color. Tu color asignado es: " + relacionPadre.getColorAsignado());
                }
            }
        }
        
        // Ningún padre tiene color aún - asignar el elegido
        relacionPadre.setColorAsignado(colorElegido);
        relacionRepository.save(relacionPadre);
        
        // Determinar el color opuesto
        String colorOpuesto = "LILA".equals(colorElegido) ? "CELESTE" : "LILA";
        
        // Buscar al co-padre y asignarle el color opuesto automáticamente
        String colorCoPadre = null;
        
        for (RelacionPadreHijo relacion : todasRelaciones) {
            if (!relacion.getPadre().getId().equals(padreId)) {
                // Este es el co-padre, asignarle el color opuesto
                relacion.setColorAsignado(colorOpuesto);
                relacionRepository.save(relacion);
                colorCoPadre = colorOpuesto;
                break;
            }
        }
        
        return new SeleccionColorResponseDTO(
                colorElegido,
                colorCoPadre,
                "Color seleccionado exitosamente"
        );
    }
    
    private String determinarColorDisponible(Long hijoId) {
        List<RelacionPadreHijo> relaciones = relacionRepository.findByHijoId(hijoId);
        
        boolean lilaOcupado = relaciones.stream()
            .anyMatch(r -> "LILA".equals(r.getColorAsignado()));
        
        return lilaOcupado ? "CELESTE" : "LILA";
    }
    
    private HijoResponseDTO convertirAResponseDTO(Hijo hijo, Long padreId) {
        HijoResponseDTO dto = new HijoResponseDTO();
        dto.setId(hijo.getId());
        dto.setNombre(hijo.getNombre());
        dto.setApellido(hijo.getApellido());
        dto.setFechaNacimiento(hijo.getFechaNacimiento());
        
        relacionRepository.findByPadreIdAndHijoId(padreId, hijo.getId())
            .ifPresent(relacion -> dto.setColorPadre(relacion.getColorAsignado()));
        
        return dto;
    }
}
