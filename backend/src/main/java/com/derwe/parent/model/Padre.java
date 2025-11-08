package com.derwe.parent.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "padres")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Padre {
    
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
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(nullable = false)
    private String password;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    // Relaciones
    @OneToMany(mappedBy = "padre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RelacionPadreHijo> relacionesHijos = new ArrayList<>();
    
    @OneToMany(mappedBy = "padreEmisor", cascade = CascadeType.ALL)
    private List<Invitacion> invitacionesEnviadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "padreCreador", cascade = CascadeType.ALL)
    private List<Actividad> actividadesCreadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "padreResponsable", cascade = CascadeType.ALL)
    private List<FechaCustodia> fechasCustodia = new ArrayList<>();
    
    @OneToMany(mappedBy = "padreDestinatario", cascade = CascadeType.ALL)
    private List<Notificacion> notificaciones = new ArrayList<>();
}
