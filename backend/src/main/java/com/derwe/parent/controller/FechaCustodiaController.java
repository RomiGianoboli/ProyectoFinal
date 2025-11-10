package com.derwe.parent.controller;

import com.derwe.parent.dto.request.FechaCustodiaRequestDTO;
import com.derwe.parent.dto.response.FechaCustodiaResponseDTO;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.FechaCustodiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/custodias")
@RequiredArgsConstructor
public class FechaCustodiaController {
    
    private final FechaCustodiaService fechaCustodiaService;
    private final PadreRepository padreRepository;
    
    private Long obtenerPadreIdDesdeAutenticacion(Authentication authentication) {
        String email = authentication.getName();
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
        return padre.getId();
    }
    
    @PostMapping
    public ResponseEntity<List<FechaCustodiaResponseDTO>> establecerFechasCustodia(
            @Valid @RequestBody FechaCustodiaRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<FechaCustodiaResponseDTO> response = fechaCustodiaService.establecerFechasCustodia(padreId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/hijo/{hijoId}")
    public ResponseEntity<List<FechaCustodiaResponseDTO>> obtenerCustodiasPorHijo(
            @PathVariable Long hijoId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<FechaCustodiaResponseDTO> custodias = fechaCustodiaService.obtenerCustodiasPorHijo(hijoId, padreId);
        return ResponseEntity.ok(custodias);
    }
    
    @GetMapping("/hijo/{hijoId}/mes/{anio}/{mes}")
    public ResponseEntity<List<FechaCustodiaResponseDTO>> obtenerCustodiasPorHijoYMes(
            @PathVariable Long hijoId,
            @PathVariable int anio,
            @PathVariable int mes,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<FechaCustodiaResponseDTO> custodias = fechaCustodiaService.obtenerCustodiasPorHijoYMes(hijoId, anio, mes, padreId);
        return ResponseEntity.ok(custodias);
    }
}
