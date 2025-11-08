package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FechaCustodiaResponseDTO {
    
    private Long id;
    private Long hijoId;
    private LocalDate fecha;
    private String colorPadreResponsable;
    private Long padreResponsableId;
    private String nombrePadreResponsable;
    private String estado;
}
