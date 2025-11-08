package com.derwe.parent.repository;

import com.derwe.parent.model.EstadoSolicitud;
import com.derwe.parent.model.SolicitudCambio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudCambioRepository extends JpaRepository<SolicitudCambio, Long> {
    
    List<SolicitudCambio> findByHijoId(Long hijoId);
    
    List<SolicitudCambio> findByPadreSolicitanteId(Long padreSolicitanteId);
    
    List<SolicitudCambio> findByPadreReceptorId(Long padreReceptorId);
    
    List<SolicitudCambio> findByEstado(EstadoSolicitud estado);
    
    @Query("SELECT s FROM SolicitudCambio s WHERE s.padreReceptor.id = :padreReceptorId AND s.estado = :estado")
    List<SolicitudCambio> findByPadreReceptorIdAndEstado(
        @Param("padreReceptorId") Long padreReceptorId,
        @Param("estado") EstadoSolicitud estado
    );
    
    @Query("SELECT s FROM SolicitudCambio s WHERE s.hijo.id = :hijoId AND s.estado = :estado")
    List<SolicitudCambio> findByHijoIdAndEstado(
        @Param("hijoId") Long hijoId,
        @Param("estado") EstadoSolicitud estado
    );
}
