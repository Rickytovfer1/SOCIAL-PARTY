package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientePublicacionDTO {
    private String nombre;
    private String apellidos;
    private String texto;
    private String lugar;
    private Integer idUsuario;
}
