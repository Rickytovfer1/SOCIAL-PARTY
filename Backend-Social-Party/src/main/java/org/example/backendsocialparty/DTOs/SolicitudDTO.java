package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudDTO {
    Integer idUsuario1;
    Integer idUsuario2;
    LocalDateTime fechaSolicitud;
}
