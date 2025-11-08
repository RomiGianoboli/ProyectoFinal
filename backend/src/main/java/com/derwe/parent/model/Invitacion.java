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
import java.util.UUID;

@Entity
@Table(name = "invitaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invitacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_emisor_id", nullable = false)
    private Padre padreEmisor;
    
    @NotBlank(message = "El nombre del co-padre es obligatorio")
    @Size(min = 2, max = 50)
    @Column(nullable = false, length = 50)
    private String nombreCoPadre;
    
    @NotBlank(message = "El apellido del co-padre es obligatorio")
    @Size(min = 2, max = 50)
    @Column(nullable = false, length = 50)
    private String apellidoCoPadre;
    
    @NotBlank(message = "El email del co-padre es obligatorio")
    @Email(message = "El email debe ser válido")
    @Column(nullable = false, length = 100)
    private String emailCoPadre;
    
    @Column(nullable = false, unique = true)
    private String token = UUID.randomUUID().toString();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoInvitacion estado = EstadoInvitacion.PENDIENTE;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaEnvio;
    
    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;
    
    private LocalDateTime fechaAceptacion;
    
    @PrePersist
    public void prePersist() {
        if (fechaExpiracion == null) {
            // Expira en 7 días
            fechaExpiracion = LocalDateTime.now().plusDays(7);
        }
    }
}
