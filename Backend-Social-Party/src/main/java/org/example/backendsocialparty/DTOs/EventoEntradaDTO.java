package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoEntradaDTO {
    Integer id;
    String titulo;
    EmpresaEntradaDTO empresa;
}
