package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDTO {
    private int id;
    private String nombre;
    private String apellidos;
    private String correo;
    private String dni;
    private String telefono;
    private String valoracion;
    private Set<Integer> amigos;
    private Set<Integer> entradas;
    private Set<Integer> grupos;
    private Integer idUsuario;
}
