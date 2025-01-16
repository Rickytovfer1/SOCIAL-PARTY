package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoDTO {
    private int id;
    private LocalTime horaApertura;
    private LocalTime horaFinalizacion;
    private LocalDate fecha;
    private String titulo;
    private String foto;
    private String descripcion;
    private Integer idEmpresario;
}
