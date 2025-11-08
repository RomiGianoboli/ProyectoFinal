package com.derwe.parent.service;

import com.derwe.parent.dto.request.LoginRequestDTO;
import com.derwe.parent.dto.request.PadreRequestDTO;
import com.derwe.parent.dto.response.LoginResponseDTO;

public interface AuthService {
    
    LoginResponseDTO registrar(PadreRequestDTO padreRequestDTO);
    
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    
    boolean validarToken(String token);
    
    String obtenerEmailDelToken(String token);
}
