package com.derwe.parent.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SeleccionColorRequestDTO {
    
    @NotBlank(message = "El color es obligatorio")
    @Pattern(regexp = "^(LILA|CELESTE)$", message = "El color debe ser LILA o CELESTE")
    private String color;
}
