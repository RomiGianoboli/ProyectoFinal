package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitacionResponseDTO {
    
    private Long id;
    private String nombreCoPadre;
    private String apellidoCoPadre;
    private String emailCoPadre;
    private String estado;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaExpiracion;
}
