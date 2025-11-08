package com.derwe.parent.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FechaCustodiaRequestDTO {
    
    @NotNull(message = "El ID del hijo es obligatorio")
    private Long hijoId;
    
    @NotNull(message = "Las fechas son obligatorias")
    private List<LocalDate> fechas;
}
