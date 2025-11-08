package com.derwe.parent.service;

import com.derwe.parent.dto.request.PadreRequestDTO;
import com.derwe.parent.dto.response.PadreResponseDTO;

import java.util.Optional;

public interface PadreService {
    
    PadreResponseDTO registrarPadre(PadreRequestDTO padreRequestDTO);
    
    Optional<PadreResponseDTO> buscarPorEmail(String email);
    
    Optional<PadreResponseDTO> buscarPorId(Long id);
    
    PadreResponseDTO actualizarPadre(Long id, PadreRequestDTO padreRequestDTO);
    
    void desactivarPadre(Long id);
}
