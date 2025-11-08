package com.derwe.parent.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hijos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hijo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(nullable = false, length = 50)
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @Column(nullable = false, length = 50)
    private String apellido;
    
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    @Column(nullable = false)
    private LocalDate fechaNacimiento;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
    
    // Relaciones
    @OneToMany(mappedBy = "hijo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RelacionPadreHijo> relacionesPadres = new ArrayList<>();
    
    @OneToMany(mappedBy = "hijo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Actividad> actividades = new ArrayList<>();
    
    @OneToMany(mappedBy = "hijo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FechaCustodia> fechasCustodia = new ArrayList<>();
    
    @OneToMany(mappedBy = "hijo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolicitudCambio> solicitudesCambio = new ArrayList<>();
}
