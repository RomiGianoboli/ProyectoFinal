package com.derwe.parent.service;

import com.derwe.parent.dto.response.CalendarioResponseDTO;
import com.derwe.parent.dto.response.CalendarioResponseDTO.DiaCalendarioDTO;
import com.derwe.parent.model.Actividad;
import com.derwe.parent.model.FechaCustodia;
import com.derwe.parent.model.Hijo;
import com.derwe.parent.model.SolicitudCambio;
import com.derwe.parent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarioService {
    
    private final HijoRepository hijoRepository;
    private final ActividadRepository actividadRepository;
    private final FechaCustodiaRepository fechaCustodiaRepository;
    private final SolicitudCambioRepository solicitudCambioRepository;
    private final RelacionPadreHijoRepository relacionRepository;
    
    @Transactional(readOnly = true)
    public CalendarioResponseDTO obtenerCalendarioMensual(Long hijoId, int anio, int mes, Long padreId) {
        Hijo hijo = hijoRepository.findById(hijoId)
            .orElseThrow(() -> new RuntimeException("Hijo no encontrado"));
        
        if (!relacionRepository.existsByPadreIdAndHijoId(padreId, hijoId)) {
            throw new RuntimeException("No tienes acceso a este hijo");
        }
        
        YearMonth yearMonth = YearMonth.of(anio, mes);
        LocalDate fechaInicio = yearMonth.atDay(1);
        LocalDate fechaFin = yearMonth.atEndOfMonth();
        
        List<Actividad> actividades = actividadRepository.findByHijoIdAndFechaBetween(hijoId, fechaInicio, fechaFin);
        List<FechaCustodia> custodias = fechaCustodiaRepository.findByHijoIdAndFechaBetween(hijoId, fechaInicio, fechaFin);
        List<SolicitudCambio> solicitudes = solicitudCambioRepository.findByHijoId(hijoId);
        
        Map<LocalDate, Long> actividadesPorDia = actividades.stream()
            .collect(Collectors.groupingBy(Actividad::getFecha, Collectors.counting()));
        
        Map<LocalDate, FechaCustodia> custodiasPorDia = custodias.stream()
            .collect(Collectors.toMap(FechaCustodia::getFecha, fc -> fc, (fc1, fc2) -> fc1));
        
        List<DiaCalendarioDTO> dias = new ArrayList<>();
        LocalDate fecha = fechaInicio;
        
        while (!fecha.isAfter(fechaFin)) {
            DiaCalendarioDTO dia = new DiaCalendarioDTO();
            dia.setFecha(fecha);
            
            FechaCustodia custodia = custodiasPorDia.get(fecha);
            if (custodia != null) {
                relacionRepository.findByPadreIdAndHijoId(
                    custodia.getPadreResponsable().getId(), 
                    hijoId
                ).ifPresent(r -> dia.setColorCustodia(r.getColorAsignado()));
            }
            
            Long cantActividades = actividadesPorDia.getOrDefault(fecha, 0L);
            dia.setCantidadActividades(cantActividades.intValue());
            
            LocalDate fechaFinal = fecha;
            boolean tieneSolicitud = solicitudes.stream()
                .anyMatch(s -> !fechaFinal.isBefore(s.getFechaDesde()) && 
                              !fechaFinal.isAfter(s.getFechaHasta()) &&
                              s.getEstado().name().equals("PENDIENTE"));
            dia.setTieneCambioSolicitado(tieneSolicitud);
            
            dias.add(dia);
            fecha = fecha.plusDays(1);
        }
        
        CalendarioResponseDTO calendario = new CalendarioResponseDTO();
        calendario.setHijoId(hijoId);
        calendario.setNombreHijo(hijo.getNombre() + " " + hijo.getApellido());
        calendario.setMes(mes);
        calendario.setAnio(anio);
        calendario.setDias(dias);
        
        relacionRepository.findByPadreIdAndHijoId(padreId, hijoId)
            .ifPresent(r -> calendario.setColorPadre(r.getColorAsignado()));
        
        return calendario;
    }
}
