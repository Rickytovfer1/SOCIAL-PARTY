package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MostrarPublicacionDTO {
    private Integer id;
    private String nombre;
    private String apellidos;
    private String texto;
    private LocalDateTime fecha;
    private String foto;
    private String lugar;
    private Integer idUsuario;
}
