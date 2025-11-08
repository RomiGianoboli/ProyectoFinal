package com.derwe.parent.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "relacion_padre_hijo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelacionPadreHijo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_id", nullable = false)
    private Padre padre;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hijo_id", nullable = false)
    private Hijo hijo;
    
    @NotBlank(message = "El color asignado es obligatorio")
    @Pattern(regexp = "^(LILA|CELESTE)$", message = "El color debe ser LILA o CELESTE")
    @Column(nullable = false, length = 10)
    private String colorAsignado; // LILA o CELESTE
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaAsignacion;
    
    @Column(nullable = false)
    private Boolean esPadreCreador = false;
}
