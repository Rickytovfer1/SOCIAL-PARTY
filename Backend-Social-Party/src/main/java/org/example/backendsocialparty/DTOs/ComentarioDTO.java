package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComentarioDTO {
    private String texto;
    private String nombre;
    private int id_cliente;
    private int id_publicacion;
    private LocalDateTime fecha;
}
