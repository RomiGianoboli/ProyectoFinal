package com.derwe.parent.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCambioRequestDTO {
    
    @NotNull(message = "El ID del hijo es obligatorio")
    private Long hijoId;
    
    @NotNull(message = "La fecha desde es obligatoria")
    private LocalDate fechaDesde;
    
    @NotNull(message = "La fecha hasta es obligatoria")
    private LocalDate fechaHasta;
    
    @NotNull(message = "El tipo de solicitud es obligatorio")
    private String tipoSolicitud; // ESTABLECER o CAMBIO
    
    @Size(max = 500, message = "El motivo no puede exceder 500 caracteres")
    private String motivo;
}
