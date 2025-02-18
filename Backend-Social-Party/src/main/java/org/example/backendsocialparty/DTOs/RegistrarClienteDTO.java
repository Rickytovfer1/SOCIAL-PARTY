package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrarClienteDTO {

    //TABLA CLIENTE
    private String nombre;
    private String apellidos;
    private String dni;
    private String fechaNacimiento;
    private String telefono;
    private String biografia;
    private String fotoPerfil;

    // TABLA USUARIO
    private String correo;
    private String contrasena;
}
