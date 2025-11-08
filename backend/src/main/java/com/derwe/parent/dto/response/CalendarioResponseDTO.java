package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarioResponseDTO {
    
    private Long hijoId;
    private String nombreHijo;
    private int mes;
    private int anio;
    private String colorPadre; // Color del padre que hace la petición
    private List<DiaCalendarioDTO> dias;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiaCalendarioDTO {
        private LocalDate fecha;
        private String colorCustodia; // LILA, CELESTE o null
        private Integer cantidadActividades;
        private Boolean tieneCambioSolicitado;
    }
}
