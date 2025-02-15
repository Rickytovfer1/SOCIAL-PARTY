package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoEntradaDTO {
    private Integer id;
    private String titulo;
    private String fecha;
    private String horaApertura;
    private String horaFinalizacion;
    private Double precio;
    private EmpresaEntradaDTO empresa;
}
