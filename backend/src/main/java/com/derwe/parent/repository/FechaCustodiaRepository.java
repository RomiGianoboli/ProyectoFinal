package com.derwe.parent.repository;

import com.derwe.parent.model.EstadoCustodia;
import com.derwe.parent.model.FechaCustodia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FechaCustodiaRepository extends JpaRepository<FechaCustodia, Long> {
    
    List<FechaCustodia> findByHijoId(Long hijoId);
    
    Optional<FechaCustodia> findByHijoIdAndFecha(Long hijoId, LocalDate fecha);
    
    @Query("SELECT f FROM FechaCustodia f WHERE f.hijo.id = :hijoId AND f.fecha BETWEEN :fechaInicio AND :fechaFin")
    List<FechaCustodia> findByHijoIdAndFechaBetween(
        @Param("hijoId") Long hijoId, 
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin
    );
    
    List<FechaCustodia> findByPadreResponsableId(Long padreResponsableId);
    
    @Query("SELECT f FROM FechaCustodia f WHERE f.hijo.id = :hijoId AND f.padreResponsable.id = :padreId AND f.fecha = :fecha")
    Optional<FechaCustodia> findByHijoIdAndPadreIdAndFecha(
        @Param("hijoId") Long hijoId,
        @Param("padreId") Long padreId,
        @Param("fecha") LocalDate fecha
    );
    
    List<FechaCustodia> findByEstado(EstadoCustodia estado);
}
