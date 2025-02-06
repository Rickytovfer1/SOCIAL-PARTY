package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backendsocialparty.modelos.Cliente;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntradaDTO {
    private Integer id;
    private LocalDateTime fecha;
    private ClienteDTO cliente;
    private EventoEntradaDTO evento;
}
