package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {
    private int id;
    private String nombre;
    private String direccion;
    private String cp;
    private String correo;
    private String nif;
    private String telefono;
    private Integer valoracionMinima;
    private Set<Integer> eventos;
    private Integer idUsuario;
}
