package com.derwe.parent.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitacionRequestDTO {
    
    @NotBlank(message = "El nombre del co-padre es obligatorio")
    @Size(min = 2, max = 50)
    private String nombreCoPadre;
    
    @NotBlank(message = "El apellido del co-padre es obligatorio")
    @Size(min = 2, max = 50)
    private String apellidoCoPadre;
    
    @NotBlank(message = "El email del co-padre es obligatorio")
    @Email(message = "El email debe ser válido")
    private String emailCoPadre;
}
