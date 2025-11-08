package com.derwe.parent.controller;

import com.derwe.parent.dto.request.HijoRequestDTO;
import com.derwe.parent.dto.response.HijoResponseDTO;
import com.derwe.parent.service.HijoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hijos")
@RequiredArgsConstructor
public class HijoController {
    
    private final HijoService hijoService;
    
    @PostMapping
    public ResponseEntity<HijoResponseDTO> registrarHijo(
            @Valid @RequestBody HijoRequestDTO request,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        HijoResponseDTO response = hijoService.registrarHijo(padreId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/{hijoId}/vincular/{coPadreId}")
    public ResponseEntity<Void> vincularHijoConCoPadre(
            @PathVariable Long hijoId,
            @PathVariable Long coPadreId,
            Authentication authentication) {
        hijoService.vincularHijoConCoPadre(hijoId, coPadreId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping
    public ResponseEntity<List<HijoResponseDTO>> obtenerHijosPorPadre(
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        List<HijoResponseDTO> hijos = hijoService.obtenerHijosPorPadre(padreId);
        return ResponseEntity.ok(hijos);
    }
    
    @GetMapping("/{hijoId}")
    public ResponseEntity<HijoResponseDTO> obtenerHijoPorId(
            @PathVariable Long hijoId,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        HijoResponseDTO hijo = hijoService.obtenerHijoPorId(hijoId, padreId);
        return ResponseEntity.ok(hijo);
    }
}
