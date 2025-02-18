package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudDTO {
    private Integer id;
    private Integer idUsuario1;
    private Integer idUsuario2;
}
