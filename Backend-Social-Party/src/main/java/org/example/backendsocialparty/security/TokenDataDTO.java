package org.example.backendsocialparty.security;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenDataDTO {
    private String correo;
    private String rol;
    private Long fecha_creacion;
    private Long fecha_expiracion;
}
