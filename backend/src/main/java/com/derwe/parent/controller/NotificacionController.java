package com.derwe.parent.controller;

import com.derwe.parent.dto.response.NotificacionResponseDTO;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {
    
    private final NotificacionService notificacionService;
    private final PadreRepository padreRepository;
    
    private Long obtenerPadreIdDesdeAutenticacion(Authentication authentication) {
        String email = authentication.getName();
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
        return padre.getId();
    }
    
    @GetMapping
    public ResponseEntity<List<NotificacionResponseDTO>> obtenerNotificaciones(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<NotificacionResponseDTO> notificaciones = notificacionService.obtenerNotificacionesPorPadre(padreId);
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/no-leidas")
    public ResponseEntity<List<NotificacionResponseDTO>> obtenerNotificacionesNoLeidas(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<NotificacionResponseDTO> notificaciones = notificacionService.obtenerNotificacionesNoLeidas(padreId);
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/contador")
    public ResponseEntity<Long> contarNotificacionesNoLeidas(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        Long contador = notificacionService.contarNotificacionesNoLeidas(padreId);
        return ResponseEntity.ok(contador);
    }
    
    @PutMapping("/{notificacionId}/leer")
    public ResponseEntity<NotificacionResponseDTO> marcarComoLeida(
            @PathVariable Long notificacionId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        NotificacionResponseDTO response = notificacionService.marcarComoLeida(notificacionId, padreId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasComoLeidas(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        notificacionService.marcarTodasComoLeidas(padreId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{notificacionId}")
    public ResponseEntity<Void> eliminarNotificacion(
            @PathVariable Long notificacionId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        notificacionService.eliminarNotificacion(notificacionId, padreId);
        return ResponseEntity.noContent().build();
    }
}
