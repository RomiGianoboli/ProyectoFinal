package com.derwe.parent.service.impl;

import com.derwe.parent.dto.request.PadreRequestDTO;
import com.derwe.parent.dto.response.PadreResponseDTO;
import com.derwe.parent.exception.DuplicateEmailException;
import com.derwe.parent.exception.ResourceNotFoundException;
import com.derwe.parent.model.Padre;
import com.derwe.parent.repository.PadreRepository;
import com.derwe.parent.service.PadreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PadreServiceImpl implements PadreService {
    
    private final PadreRepository padreRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public PadreResponseDTO registrarPadre(PadreRequestDTO padreRequestDTO) {
        // Verificar si el email ya existe
        if (padreRepository.findByEmail(padreRequestDTO.getEmail()).isPresent()) {
            throw new DuplicateEmailException("El email ya está registrado");
        }
        
        // Crear entidad Padre
        Padre padre = new Padre();
        padre.setNombre(padreRequestDTO.getNombre());
        padre.setApellido(padreRequestDTO.getApellido());
        padre.setEmail(padreRequestDTO.getEmail());
        padre.setPassword(passwordEncoder.encode(padreRequestDTO.getPassword()));
        padre.setActivo(true);
        padre.setFechaRegistro(LocalDateTime.now());
        
        Padre padreSaved = padreRepository.save(padre);
        
        return mapearAPadreResponseDTO(padreSaved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PadreResponseDTO> buscarPorEmail(String email) {
        return padreRepository.findByEmail(email)
                .map(this::mapearAPadreResponseDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PadreResponseDTO> buscarPorId(Long id) {
        return padreRepository.findById(id)
                .map(this::mapearAPadreResponseDTO);
    }
    
    @Override
    public PadreResponseDTO actualizarPadre(Long id, PadreRequestDTO padreRequestDTO) {
        Padre padre = padreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Padre no encontrado"));
        
        padre.setNombre(padreRequestDTO.getNombre());
        padre.setApellido(padreRequestDTO.getApellido());
        
        // Solo actualizar password si se proporciona uno nuevo
        if (padreRequestDTO.getPassword() != null && !padreRequestDTO.getPassword().isEmpty()) {
            padre.setPassword(passwordEncoder.encode(padreRequestDTO.getPassword()));
        }
        
        Padre padreActualizado = padreRepository.save(padre);
        
        return mapearAPadreResponseDTO(padreActualizado);
    }
    
    @Override
    public void desactivarPadre(Long id) {
        Padre padre = padreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Padre no encontrado"));
        
        padre.setActivo(false);
        padreRepository.save(padre);
    }
    
    // Mapper: Padre Entity -> PadreResponseDTO
    private PadreResponseDTO mapearAPadreResponseDTO(Padre padre) {
        return PadreResponseDTO.builder()
                .id(padre.getId())
                .nombre(padre.getNombre())
                .apellido(padre.getApellido())
                .email(padre.getEmail())
                .activo(padre.getActivo())
                .fechaRegistro(padre.getFechaRegistro())
                .build();
    }
}
