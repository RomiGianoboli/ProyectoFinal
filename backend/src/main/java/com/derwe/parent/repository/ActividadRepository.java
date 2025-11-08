package com.derwe.parent.repository;

import com.derwe.parent.model.Actividad;
import com.derwe.parent.model.EstadoActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    
    List<Actividad> findByHijoId(Long hijoId);
    
    List<Actividad> findByHijoIdAndFecha(Long hijoId, LocalDate fecha);
    
    @Query("SELECT a FROM Actividad a WHERE a.hijo.id = :hijoId AND a.fecha BETWEEN :fechaInicio AND :fechaFin")
    List<Actividad> findByHijoIdAndFechaBetween(
        @Param("hijoId") Long hijoId, 
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin
    );
    
    List<Actividad> findByPadreCreadorId(Long padreCreadorId);
    
    List<Actividad> findByEstado(EstadoActividad estado);
    
    @Query("SELECT a FROM Actividad a WHERE a.hijo.id = :hijoId AND a.estado = :estado")
    List<Actividad> findByHijoIdAndEstado(
        @Param("hijoId") Long hijoId, 
        @Param("estado") EstadoActividad estado
    );
}
