package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicacionDTO {
    private String texto;
    private String titulo;
    private String foto;
    private String direccion;
    private Integer idUsuario;
}
