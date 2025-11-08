package com.derwe.parent.controller;

import com.derwe.parent.dto.response.NotificacionResponseDTO;
import com.derwe.parent.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {
    
    private final NotificacionService notificacionService;
    
    @GetMapping
    public ResponseEntity<List<NotificacionResponseDTO>> obtenerNotificaciones(
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        List<NotificacionResponseDTO> notificaciones = notificacionService.obtenerNotificacionesPorPadre(padreId);
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/no-leidas")
    public ResponseEntity<List<NotificacionResponseDTO>> obtenerNotificacionesNoLeidas(
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        List<NotificacionResponseDTO> notificaciones = notificacionService.obtenerNotificacionesNoLeidas(padreId);
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/contador")
    public ResponseEntity<Long> contarNotificacionesNoLeidas(
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        Long contador = notificacionService.contarNotificacionesNoLeidas(padreId);
        return ResponseEntity.ok(contador);
    }
    
    @PutMapping("/{notificacionId}/leer")
    public ResponseEntity<NotificacionResponseDTO> marcarComoLeida(
            @PathVariable Long notificacionId,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        NotificacionResponseDTO response = notificacionService.marcarComoLeida(notificacionId, padreId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasComoLeidas(
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        notificacionService.marcarTodasComoLeidas(padreId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{notificacionId}")
    public ResponseEntity<Void> eliminarNotificacion(
            @PathVariable Long notificacionId,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        notificacionService.eliminarNotificacion(notificacionId, padreId);
        return ResponseEntity.noContent().build();
    }
}
