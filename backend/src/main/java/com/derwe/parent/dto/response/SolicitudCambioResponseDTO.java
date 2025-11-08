package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCambioResponseDTO {
    
    private Long id;
    private Long hijoId;
    private String nombreHijo;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private String estado;
    private String motivo;
    private Long padreSolicitanteId;
    private String nombrePadreSolicitante;
    private Long padreReceptorId;
    private String nombrePadreReceptor;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaResolucion;
}
