package com.derwe.parent.repository;

import com.derwe.parent.model.EstadoInvitacion;
import com.derwe.parent.model.Invitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitacionRepository extends JpaRepository<Invitacion, Long> {
    
    Optional<Invitacion> findByToken(String token);
    
    List<Invitacion> findByPadreEmisorId(Long padreEmisorId);
    
    List<Invitacion> findByEmailCoPadre(String emailCoPadre);
    
    List<Invitacion> findByEstado(EstadoInvitacion estado);
    
    Boolean existsByEmailCoPadreAndEstado(String emailCoPadre, EstadoInvitacion estado);
}
