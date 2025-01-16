package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntradaDTO {
    private int id;
    private LocalDate fecha;
    private Integer idCliente;
    private Integer idEvento;
}
