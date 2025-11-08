package com.derwe.parent.repository;

import com.derwe.parent.model.Notificacion;
import com.derwe.parent.model.TipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    
    List<Notificacion> findByPadreDestinatarioId(Long padreDestinatarioId);
    
    @Query("SELECT n FROM Notificacion n WHERE n.padreDestinatario.id = :padreId AND n.leida = :leida")
    List<Notificacion> findByPadreDestinatarioIdAndLeida(
        @Param("padreId") Long padreId,
        @Param("leida") Boolean leida
    );
    
    List<Notificacion> findByTipo(TipoNotificacion tipo);
    
    @Query("SELECT COUNT(n) FROM Notificacion n WHERE n.padreDestinatario.id = :padreId AND n.leida = false")
    Long countNotificacionesNoLeidas(@Param("padreId") Long padreId);
    
    @Query("SELECT n FROM Notificacion n WHERE n.padreDestinatario.id = :padreId ORDER BY n.fechaCreacion DESC")
    List<Notificacion> findByPadreDestinatarioIdOrderByFechaCreacionDesc(@Param("padreId") Long padreId);
}
