package com.derwe.parent.controller;

import com.derwe.parent.dto.response.CalendarioResponseDTO;
import com.derwe.parent.service.CalendarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calendario")
@RequiredArgsConstructor
public class CalendarioController {
    
    private final CalendarioService calendarioService;
    
    @GetMapping("/hijo/{hijoId}/mes/{anio}/{mes}")
    public ResponseEntity<CalendarioResponseDTO> obtenerCalendarioMensual(
            @PathVariable Long hijoId,
            @PathVariable int anio,
            @PathVariable int mes,
            Authentication authentication) {
        Long padreId = Long.parseLong(authentication.getName());
        CalendarioResponseDTO calendario = calendarioService.obtenerCalendarioMensual(hijoId, anio, mes, padreId);
        return ResponseEntity.ok(calendario);
    }
}
