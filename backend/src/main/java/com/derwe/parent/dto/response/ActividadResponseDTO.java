package com.derwe.parent.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActividadResponseDTO {
    
    private Long id;
    private Long hijoId;
    private String nombreHijo;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String nombre;
    private String descripcion;
    private String estado;
    private String colorCreador; // Color del padre que creó la actividad
    private Long padreCreadorId;
    private String nombrePadreCreador;
    private Boolean puedeEditar; // Si el padre actual puede editarla
}
