package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDTO {
    private Integer id;
    private String nombre;
    private String apellidos;
    private String dni;
    private String telefono;
    private LocalDate fechaNacimiento;
    private Integer valoracion;
    private String biografia;
    private String fotoPerfil;
    private Set<Integer> amigos;
    private Set<Integer> entradas;
    private Set<Integer> grupos;
    private Integer idUsuario;
    private String correo;
}
