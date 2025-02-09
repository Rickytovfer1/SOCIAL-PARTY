package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicacionDTO {
    private String nombre;
    private String texto;
    private String lugar;
    private Integer idUsuario;
}
