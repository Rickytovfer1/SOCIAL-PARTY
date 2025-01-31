// EmpresaDTO.java

package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {
    private Integer id;
    private String nombre;
    private String direccion;
    private String cp;
    private String nif;
    private String fotoPerfil;
    private String telefono;
    private Integer valoracionMinima;
    private Integer edadMinima;
    private Set<Integer> eventos;
    private Integer idUsuario;
    private String correo;
}
