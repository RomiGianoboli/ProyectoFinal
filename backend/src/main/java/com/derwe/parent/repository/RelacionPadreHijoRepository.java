package com.derwe.parent.repository;

import com.derwe.parent.model.RelacionPadreHijo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelacionPadreHijoRepository extends JpaRepository<RelacionPadreHijo, Long> {
    
    List<RelacionPadreHijo> findByPadreId(Long padreId);
    
    List<RelacionPadreHijo> findByHijoId(Long hijoId);
    
    Optional<RelacionPadreHijo> findByPadreIdAndHijoId(Long padreId, Long hijoId);
    
    Boolean existsByPadreIdAndHijoId(Long padreId, Long hijoId);
    
    Optional<RelacionPadreHijo> findByHijoIdAndEsPadreCreadorTrue(Long hijoId);
}
