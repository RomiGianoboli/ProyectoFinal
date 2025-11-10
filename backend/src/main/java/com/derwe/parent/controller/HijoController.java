package com.derwe.parent.controller;

import com.derwe.parent.dto.request.HijoRequestDTO;
import com.derwe.parent.dto.request.SeleccionColorRequestDTO;
import com.derwe.parent.dto.response.HijoResponseDTO;
import com.derwe.parent.dto.response.SeleccionColorResponseDTO;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.HijoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/hijos")
@RequiredArgsConstructor
public class HijoController {
    
    private final HijoService hijoService;
    private final PadreRepository padreRepository;
    
    private Long obtenerPadreIdDesdeAutenticacion(Authentication authentication) {
        String email = authentication.getName();
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
        return padre.getId();
    }
    
    @PostMapping
    public ResponseEntity<HijoResponseDTO> registrarHijo(
            @Valid @RequestBody HijoRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
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
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<HijoResponseDTO> hijos = hijoService.obtenerHijosPorPadre(padreId);
        return ResponseEntity.ok(hijos);
    }
    
    @GetMapping("/{hijoId}")
    public ResponseEntity<HijoResponseDTO> obtenerHijoPorId(
            @PathVariable Long hijoId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        HijoResponseDTO hijo = hijoService.obtenerHijoPorId(hijoId, padreId);
        return ResponseEntity.ok(hijo);
    }
    
    @PutMapping("/{hijoId}/seleccionar-color")
    public ResponseEntity<SeleccionColorResponseDTO> seleccionarColor(
            @PathVariable Long hijoId,
            @Valid @RequestBody SeleccionColorRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        SeleccionColorResponseDTO response = hijoService.seleccionarColor(hijoId, padreId, request.getColor());
        return ResponseEntity.ok(response);
    }
}
