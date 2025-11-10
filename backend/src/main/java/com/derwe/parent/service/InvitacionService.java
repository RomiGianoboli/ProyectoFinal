package com.derwe.parent.service;

import com.derwe.parent.dto.request.InvitacionRequestDTO;
import com.derwe.parent.dto.response.InvitacionResponseDTO;
import com.derwe.parent.model.EstadoInvitacion;
import com.derwe.parent.model.Invitacion;
import com.derwe.parent.model.Padre;
import com.derwe.parent.model.RelacionPadreHijo;
import com.derwe.parent.repository.InvitacionRepository;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.repository.RelacionPadreHijoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitacionService {
    
    private final InvitacionRepository invitacionRepository;
    private final PadreRepository padreRepository;
    private final RelacionPadreHijoRepository relacionPadreHijoRepository;
    
    @Transactional
    public InvitacionResponseDTO enviarInvitacion(Long padreEmisorId, InvitacionRequestDTO request) {
        Padre padreEmisor = padreRepository.findById(padreEmisorId)
            .orElseThrow(() -> new RuntimeException("Padre emisor no encontrado"));
        
        if (padreEmisor.getEmail().equalsIgnoreCase(request.getEmailCoPadre())) {
            throw new RuntimeException("No puedes invitarte a ti mismo");
        }
        
        if (invitacionRepository.existsByEmailCoPadreAndEstado(
                request.getEmailCoPadre(), EstadoInvitacion.PENDIENTE)) {
            throw new RuntimeException("Ya existe una invitación pendiente para este email");
        }
        
        Invitacion invitacion = new Invitacion();
        invitacion.setPadreEmisor(padreEmisor);
        invitacion.setNombreCoPadre(request.getNombreCoPadre());
        invitacion.setApellidoCoPadre(request.getApellidoCoPadre());
        invitacion.setEmailCoPadre(request.getEmailCoPadre());
        invitacion.setEstado(EstadoInvitacion.ACEPTADA);
        invitacion.setFechaAceptacion(LocalDateTime.now());
        invitacion.setFechaExpiracion(LocalDateTime.now().plusDays(7));
        
        Invitacion invitacionGuardada = invitacionRepository.save(invitacion);
        
        Padre coPadre = padreRepository.findByEmail(request.getEmailCoPadre()).orElse(null);
        
        if (coPadre == null) {
            coPadre = new Padre();
            coPadre.setNombre(request.getNombreCoPadre());
            coPadre.setApellido(request.getApellidoCoPadre());
            coPadre.setEmail(request.getEmailCoPadre());
            coPadre.setPassword(padreEmisor.getPassword());
            coPadre.setActivo(true);
            coPadre = padreRepository.save(coPadre);
        }
        
        List<RelacionPadreHijo> relacionesPadreEmisor = relacionPadreHijoRepository.findByPadreId(padreEmisorId);
        
        for (RelacionPadreHijo relacionPadre : relacionesPadreEmisor) {
            if (!relacionPadreHijoRepository.existsByPadreIdAndHijoId(coPadre.getId(), relacionPadre.getHijo().getId())) {
                RelacionPadreHijo relacionCoPadre = new RelacionPadreHijo();
                relacionCoPadre.setPadre(coPadre);
                relacionCoPadre.setHijo(relacionPadre.getHijo());
                relacionCoPadre.setEsPadreCreador(false);
                
                if (relacionPadre.getColorAsignado() != null) {
                    relacionCoPadre.setColorAsignado(obtenerColorComplementario(relacionPadre.getColorAsignado()));
                }
                
                relacionPadreHijoRepository.save(relacionCoPadre);
            }
        }
        
        return convertirAResponseDTO(invitacionGuardada);
    }
    
    @Transactional
    public InvitacionResponseDTO aceptarInvitacion(String token, Long padreReceptorId) {
        Invitacion invitacion = invitacionRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invitación no encontrada"));
        
        if (invitacion.getEstado() != EstadoInvitacion.PENDIENTE) {
            throw new RuntimeException("La invitación ya fue procesada");
        }
        
        if (invitacion.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            invitacion.setEstado(EstadoInvitacion.EXPIRADA);
            invitacionRepository.save(invitacion);
            throw new RuntimeException("La invitación ha expirado");
        }
        
        invitacion.setEstado(EstadoInvitacion.ACEPTADA);
        invitacion.setFechaAceptacion(LocalDateTime.now());
        
        Invitacion invitacionActualizada = invitacionRepository.save(invitacion);
        
        return convertirAResponseDTO(invitacionActualizada);
    }
    
    @Transactional(readOnly = true)
    public List<InvitacionResponseDTO> obtenerInvitacionesEnviadas(Long padreId) {
        return invitacionRepository.findByPadreEmisorId(padreId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<InvitacionResponseDTO> obtenerInvitacionesRecibidas(String email) {
        return invitacionRepository.findByEmailCoPadre(email).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }
    
    private InvitacionResponseDTO convertirAResponseDTO(Invitacion invitacion) {
        InvitacionResponseDTO dto = new InvitacionResponseDTO();
        dto.setId(invitacion.getId());
        dto.setNombreCoPadre(invitacion.getNombreCoPadre());
        dto.setApellidoCoPadre(invitacion.getApellidoCoPadre());
        dto.setEmailCoPadre(invitacion.getEmailCoPadre());
        dto.setEstado(invitacion.getEstado().name());
        dto.setFechaEnvio(invitacion.getFechaEnvio());
        dto.setFechaExpiracion(invitacion.getFechaExpiracion());
        return dto;
    }
    
    private String obtenerColorComplementario(String color) {
        if (color == null) {
            return null;
        }
        switch (color.toUpperCase()) {
            case "LILA":
                return "CELESTE";
            case "CELESTE":
                return "LILA";
            default:
                return null;
        }
    }
}
