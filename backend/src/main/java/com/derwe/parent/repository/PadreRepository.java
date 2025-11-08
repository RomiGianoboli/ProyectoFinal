package com.derwe.parent.repository;

import com.derwe.parent.model.Padre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PadreRepository extends JpaRepository<Padre, Long> {
    
    Optional<Padre> findByEmail(String email);
    
    Boolean existsByEmail(String email);
}
