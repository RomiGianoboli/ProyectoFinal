package com.derwe.parent.controller;

import com.derwe.parent.dto.request.FechaCustodiaRequestDTO;
import com.derwe.parent.dto.response.FechaCustodiaResponseDTO;
import com.derwe.parent.service.FechaCustodiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custodias")
@RequiredArgsConstructor
public class FechaCustodiaController {
    
    private final FechaCustodiaService fechaCustodiaService;
    
    @PostMapping
    public ResponseEntity<List<FechaCustodiaResponseDTO>> establecerFechasCustodia(
            @Valid @RequestBody FechaCustodiaRequestDTO request,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        List<FechaCustodiaResponseDTO> response = fechaCustodiaService.establecerFechasCustodia(padreId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/hijo/{hijoId}")
    public ResponseEntity<List<FechaCustodiaResponseDTO>> obtenerCustodiasPorHijo(
            @PathVariable Long hijoId,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        List<FechaCustodiaResponseDTO> custodias = fechaCustodiaService.obtenerCustodiasPorHijo(hijoId, padreId);
        return ResponseEntity.ok(custodias);
    }
    
    @GetMapping("/hijo/{hijoId}/mes/{anio}/{mes}")
    public ResponseEntity<List<FechaCustodiaResponseDTO>> obtenerCustodiasPorHijoYMes(
            @PathVariable Long hijoId,
            @PathVariable int anio,
            @PathVariable int mes,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        List<FechaCustodiaResponseDTO> custodias = fechaCustodiaService.obtenerCustodiasPorHijoYMes(hijoId, anio, mes, padreId);
        return ResponseEntity.ok(custodias);
    }
}
