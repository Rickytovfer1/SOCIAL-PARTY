package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaEntradaDTO {
    private Integer id;
    private String nombre;
    private String fotoPerfil;
    private String direccion;
}
