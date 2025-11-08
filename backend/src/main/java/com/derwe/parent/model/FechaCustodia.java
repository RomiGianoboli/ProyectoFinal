package com.derwe.parent.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fechas_custodia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FechaCustodia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hijo_id", nullable = false)
    private Hijo hijo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_responsable_id", nullable = false)
    private Padre padreResponsable;
    
    @NotNull(message = "La fecha es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoCustodia estado = EstadoCustodia.CONFIRMADA;
    
    @Column(length = 20)
    private String tipoCustodia = "DIA_COMPLETO";
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
