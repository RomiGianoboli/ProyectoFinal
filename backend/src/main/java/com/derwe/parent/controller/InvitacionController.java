package com.derwe.parent.controller;

import com.derwe.parent.dto.request.InvitacionRequestDTO;
import com.derwe.parent.dto.response.InvitacionResponseDTO;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.InvitacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/invitaciones")
@RequiredArgsConstructor
public class InvitacionController {
    
    private final InvitacionService invitacionService;
    private final PadreRepository padreRepository;
    
    private Long obtenerPadreIdDesdeAutenticacion(Authentication authentication) {
        String email = authentication.getName();
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
        return padre.getId();
    }
    
    @PostMapping
    public ResponseEntity<InvitacionResponseDTO> enviarInvitacion(
            @Valid @RequestBody InvitacionRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        InvitacionResponseDTO response = invitacionService.enviarInvitacion(padreId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/{token}/aceptar")
    public ResponseEntity<InvitacionResponseDTO> aceptarInvitacion(
            @PathVariable String token,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        InvitacionResponseDTO response = invitacionService.aceptarInvitacion(token, padreId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/enviadas")
    public ResponseEntity<List<InvitacionResponseDTO>> obtenerInvitacionesEnviadas(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<InvitacionResponseDTO> invitaciones = invitacionService.obtenerInvitacionesEnviadas(padreId);
        return ResponseEntity.ok(invitaciones);
    }
    
    @GetMapping("/recibidas")
    public ResponseEntity<List<InvitacionResponseDTO>> obtenerInvitacionesRecibidas(
            Authentication authentication) {
        String email = authentication.getName();
        List<InvitacionResponseDTO> invitaciones = invitacionService.obtenerInvitacionesRecibidas(email);
        return ResponseEntity.ok(invitaciones);
    }
}
