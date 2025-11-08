package com.derwe.parent.controller;

import com.derwe.parent.dto.request.LoginRequestDTO;
import com.derwe.parent.dto.request.PadreRequestDTO;
import com.derwe.parent.dto.response.LoginResponseDTO;
import com.derwe.parent.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> registrar(@Valid @RequestBody PadreRequestDTO padreRequestDTO) {
        LoginResponseDTO response = authService.registrar(padreRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        LoginResponseDTO response = authService.login(loginRequestDTO);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validarToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
        String token = authHeader.substring(7); // Remover "Bearer "
        boolean valido = authService.validarToken(token);
        return ResponseEntity.ok(valido);
    }
}
