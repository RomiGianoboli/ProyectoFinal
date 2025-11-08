package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PadreResponseDTO {
    
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private Boolean activo;
    private LocalDateTime fechaRegistro;
}
