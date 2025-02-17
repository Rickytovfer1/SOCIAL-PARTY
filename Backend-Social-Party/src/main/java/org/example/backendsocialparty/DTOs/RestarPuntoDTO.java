package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestarPuntoDTO {
    Integer idCliente;
    Integer puntos;
    Integer idEmpresa;
    String motivo;
}
