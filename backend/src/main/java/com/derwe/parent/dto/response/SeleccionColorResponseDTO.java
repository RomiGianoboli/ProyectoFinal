package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeleccionColorResponseDTO {
    
    private String colorPadre;
    private String colorCoPadre;
    private String mensaje;
}
