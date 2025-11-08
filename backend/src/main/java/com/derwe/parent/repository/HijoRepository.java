package com.derwe.parent.repository;

import com.derwe.parent.model.Hijo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HijoRepository extends JpaRepository<Hijo, Long> {
    
    @Query("SELECT h FROM Hijo h JOIN h.relacionesPadres r WHERE r.padre.id = :padreId")
    List<Hijo> findByPadreId(@Param("padreId") Long padreId);
}
