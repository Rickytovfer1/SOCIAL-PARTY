package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntradaDTO {
    private Integer id;
    private LocalDateTime fecha;
    private Integer codigoEntrada;
    private ClienteDTO cliente;
    private EventoEntradaDTO evento;
    private QRCodeDTO qrCode;
}