package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrupoDTO {
    private Integer id;
    private String nombre;
    private Integer idCreador;
    private Set<Integer> participantes;
}
