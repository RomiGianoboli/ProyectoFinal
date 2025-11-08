package com.derwe.parent.service;

import com.derwe.parent.dto.request.FechaCustodiaRequestDTO;
import com.derwe.parent.dto.response.FechaCustodiaResponseDTO;
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
public class FechaCustodiaService {
    
    private final FechaCustodiaRepository fechaCustodiaRepository;
    private final HijoRepository hijoRepository;
    private final PadreRepository padreRepository;
    private final RelacionPadreHijoRepository relacionRepository;
    private final NotificacionService notificacionService;
    
    @Transactional
    public List<FechaCustodiaResponseDTO> establecerFechasCustodia(
            Long padreId, FechaCustodiaRequestDTO request) {
        
        Padre padre = padreRepository.findById(padreId)
            .orElseThrow(() -> new RuntimeException("Padre no encontrado"));
        
        Hijo hijo = hijoRepository.findById(request.getHijoId())
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        if (!relacionRepository.existsByPadreIdAndHijoId(padreId, request.getHijoId())) {
            throw new RuntimeException("No tienes acceso a este hijo");
        }
        
        List<FechaCustodia> fechasCreadas = request.getFechas().stream()
            .map(fecha -> {
                FechaCustodia fechaCustodia = new FechaCustodia();
                fechaCustodia.setHijo(hijo);
                fechaCustodia.setPadreResponsable(padre);
                fechaCustodia.setFecha(fecha);
                fechaCustodia.setEstado(EstadoCustodia.PENDIENTE);
                fechaCustodia.setTipoCustodia("DIA_COMPLETO");
                return fechaCustodiaRepository.save(fechaCustodia);
            })
            .collect(Collectors.toList());
        
        notificarCoPadre(hijo.getId(), padreId, TipoNotificacion.SOLICITUD_CAMBIO_CUSTODIA,
            hijo.getId(), "Nueva propuesta de fechas de custodia");
        
        return fechasCreadas.stream()
            .map(f -> convertirAResponseDTO(f, padreId))
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<FechaCustodiaResponseDTO> obtenerCustodiasPorHijo(Long hijoId, Long padreId) {
        return fechaCustodiaRepository.findByHijoId(hijoId).stream()
            .map(f -> convertirAResponseDTO(f, padreId))
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<FechaCustodiaResponseDTO> obtenerCustodiasPorHijoYMes(
            Long hijoId, int anio, int mes, Long padreId) {
        
        LocalDate fechaInicio = LocalDate.of(anio, mes, 1);
        LocalDate fechaFin = fechaInicio.plusMonths(1).minusDays(1);
        
        return fechaCustodiaRepository.findByHijoIdAndFechaBetween(hijoId, fechaInicio, fechaFin).stream()
            .map(f -> convertirAResponseDTO(f, padreId))
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
    
    private FechaCustodiaResponseDTO convertirAResponseDTO(FechaCustodia fechaCustodia, Long padreId) {
        FechaCustodiaResponseDTO dto = new FechaCustodiaResponseDTO();
        dto.setId(fechaCustodia.getId());
        dto.setHijoId(fechaCustodia.getHijo().getId());
        dto.setFecha(fechaCustodia.getFecha());
        dto.setPadreResponsableId(fechaCustodia.getPadreResponsable().getId());
        dto.setNombrePadreResponsable(
            fechaCustodia.getPadreResponsable().getNombre() + " " +
            fechaCustodia.getPadreResponsable().getApellido()
        );
        dto.setEstado(fechaCustodia.getEstado().name());
        
        relacionRepository.findByPadreIdAndHijoId(
            fechaCustodia.getPadreResponsable().getId(),
            fechaCustodia.getHijo().getId()
        ).ifPresent(r -> dto.setColorPadreResponsable(r.getColorAsignado()));
        
        return dto;
    }
}
