package com.derwe.parent.controller;

import com.derwe.parent.dto.request.ActividadRequestDTO;
import com.derwe.parent.dto.response.ActividadResponseDTO;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.ActividadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {
    
    private final ActividadService actividadService;
    private final PadreRepository padreRepository;
    
    private Long obtenerPadreIdDesdeAutenticacion(Authentication authentication) {
        String email = authentication.getName();
        Padre padre = padreRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));
        return padre.getId();
    }
    
    @PostMapping
    public ResponseEntity<ActividadResponseDTO> crearActividad(
            @Valid @RequestBody ActividadRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        ActividadResponseDTO response = actividadService.crearActividad(padreId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{actividadId}")
    public ResponseEntity<ActividadResponseDTO> editarActividad(
            @PathVariable Long actividadId,
            @Valid @RequestBody ActividadRequestDTO request,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        ActividadResponseDTO response = actividadService.editarActividad(actividadId, padreId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{actividadId}")
    public ResponseEntity<Void> eliminarActividad(
            @PathVariable Long actividadId,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        actividadService.eliminarActividad(actividadId, padreId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/hijo/{hijoId}/fecha/{fecha}")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerActividadesPorHijoYFecha(
            @PathVariable Long hijoId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<ActividadResponseDTO> actividades = actividadService.obtenerActividadesPorHijoYFecha(hijoId, fecha, padreId);
        return ResponseEntity.ok(actividades);
    }
    
    @GetMapping("/hijo/{hijoId}/mes/{anio}/{mes}")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerActividadesPorHijoYMes(
            @PathVariable Long hijoId,
            @PathVariable int anio,
            @PathVariable int mes,
            Authentication authentication) {
        Long padreId = obtenerPadreIdDesdeAutenticacion(authentication);
        List<ActividadResponseDTO> actividades = actividadService.obtenerActividadesPorHijoYMes(hijoId, anio, mes, padreId);
        return ResponseEntity.ok(actividades);
    }
}
