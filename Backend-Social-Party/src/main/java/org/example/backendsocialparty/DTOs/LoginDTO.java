package org.example.backendsocialparty.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginDTO {
    private String correo;
    private String contrasena;
}
