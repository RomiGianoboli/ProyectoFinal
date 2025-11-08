package com.derwe.parent.service.impl;

import com.derwe.parent.config.JwtUtil;
import com.derwe.parent.dto.request.LoginRequestDTO;
import com.derwe.parent.dto.request.PadreRequestDTO;
import com.derwe.parent.dto.response.LoginResponseDTO;
import com.derwe.parent.dto.response.PadreResponseDTO;
import com.derwe.parent.exception.AccountDeactivatedException;
import com.derwe.parent.exception.InvalidCredentialsException;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.AuthService;
import com.derwe.parent.service.PadreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final PadreService padreService;
    private final PadreRepository padreRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Override
    public LoginResponseDTO registrar(PadreRequestDTO padreRequestDTO) {
        // Registrar al padre usando PadreService
        PadreResponseDTO padreResponse = padreService.registrarPadre(padreRequestDTO);
        
        // Generar token JWT
        String token = jwtUtil.generarToken(padreResponse.getEmail());
        
        // Calcular fecha de expiración
        LocalDateTime expiracion = LocalDateTime.now()
                .plusSeconds(jwtUtil.getExpiracion() / 1000);
        
        return LoginResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .expiracion(expiracion)
                .padre(padreResponse)
                .build();
    }
    
    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        // Buscar padre por email
        Padre padre = padreRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));
        
        // Verificar que el padre esté activo
        if (!padre.getActivo()) {
            throw new AccountDeactivatedException("La cuenta está desactivada");
        }
        
        // Verificar password
        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), padre.getPassword())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }
        
        // Generar token JWT
        String token = jwtUtil.generarToken(padre.getEmail());
        
        // Calcular fecha de expiración
        LocalDateTime expiracion = LocalDateTime.now()
                .plusSeconds(jwtUtil.getExpiracion() / 1000);
        
        // Mapear Padre a PadreResponseDTO
        PadreResponseDTO padreResponse = PadreResponseDTO.builder()
                .id(padre.getId())
                .nombre(padre.getNombre())
                .apellido(padre.getApellido())
                .email(padre.getEmail())
                .activo(padre.getActivo())
                .fechaRegistro(padre.getFechaRegistro())
                .build();
        
        return LoginResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .expiracion(expiracion)
                .padre(padreResponse)
                .build();
    }
    
    @Override
    public boolean validarToken(String token) {
        return jwtUtil.validarToken(token);
    }
    
    @Override
    public String obtenerEmailDelToken(String token) {
        return jwtUtil.extraerEmail(token);
    }
}
