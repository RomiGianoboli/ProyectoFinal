package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HijoResponseDTO {
    
    private Long id;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String colorPadre; // Color asignado al padre que hace la petición
}
