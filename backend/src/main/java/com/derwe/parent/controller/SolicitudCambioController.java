package com.derwe.parent.controller;

import com.derwe.parent.dto.request.SolicitudCambioRequestDTO;
import com.derwe.parent.dto.response.SolicitudCambioResponseDTO;
import com.derwe.parent.model.EstadoSolicitud;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.SolicitudCambioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-cambio")
@RequiredArgsConstructor
public class SolicitudCambioController {
    
    private final SolicitudCambioService solicitudCambioService;
    private final PadreRepository padreRepository;
    
    private Long obtenerPadreIdDesdeAutenticacion(Authentication authentication) {
        String email = authentication.getName();
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
        return padre.getId();
    }
    
    @PostMapping
    public ResponseEntity<SolicitudCambioResponseDTO> crearSolicitudCambio(
            @Valid @RequestBody SolicitudCambioRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        SolicitudCambioResponseDTO response = solicitudCambioService.crearSolicitudCambio(padreId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{solicitudId}/aprobar")
    public ResponseEntity<SolicitudCambioResponseDTO> aprobarSolicitud(
            @PathVariable Long solicitudId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        SolicitudCambioResponseDTO response = solicitudCambioService.aprobarSolicitud(solicitudId, padreId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{solicitudId}/rechazar")
    public ResponseEntity<SolicitudCambioResponseDTO> rechazarSolicitud(
            @PathVariable Long solicitudId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        SolicitudCambioResponseDTO response = solicitudCambioService.rechazarSolicitud(solicitudId, padreId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/enviadas")
    public ResponseEntity<List<SolicitudCambioResponseDTO>> obtenerSolicitudesEnviadas(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<SolicitudCambioResponseDTO> solicitudes = solicitudCambioService.obtenerSolicitudesEnviadas(padreId);
        return ResponseEntity.ok(solicitudes);
    }
    
    @GetMapping("/recibidas")
    public ResponseEntity<List<SolicitudCambioResponseDTO>> obtenerSolicitudesRecibidas(
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<SolicitudCambioResponseDTO> solicitudes = solicitudCambioService.obtenerSolicitudesRecibidas(padreId);
        return ResponseEntity.ok(solicitudes);
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<SolicitudCambioResponseDTO>> obtenerSolicitudesPorEstado(
            @PathVariable EstadoSolicitud estado,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<SolicitudCambioResponseDTO> solicitudes = solicitudCambioService.obtenerSolicitudesPorEstado(padreId, estado);
        return ResponseEntity.ok(solicitudes);
    }
}
