package com.derwe.parent.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_cambio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCambio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hijo_id", nullable = false)
    private Hijo hijo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_solicitante_id", nullable = false)
    private Padre padreSolicitante;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_receptor_id", nullable = false)
    private Padre padreReceptor;
    
    @NotNull(message = "La fecha desde es obligatoria")
    @Column(nullable = false)
    private LocalDate fechaDesde;
    
    @NotNull(message = "La fecha hasta es obligatoria")
    @Column(nullable = false)
    private LocalDate fechaHasta;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;
    
    @Size(max = 500, message = "El motivo no puede exceder 500 caracteres")
    @Column(length = 500)
    private String motivo;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaSolicitud;
    
    private LocalDateTime fechaResolucion;
}
