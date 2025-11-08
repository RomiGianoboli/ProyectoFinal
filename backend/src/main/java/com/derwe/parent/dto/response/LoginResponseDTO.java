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
public class LoginResponseDTO {
    
    private String token;
    private String tipo;
    private LocalDateTime expiracion;
    private PadreResponseDTO padre;
}
