package org.example.backendsocialparty.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrarEmpresaDTO {

    //TABLA EMPRESA
    private String nombre;
    private String direccion;
    private String codigoPostal;
    private String nif;
    private String telefono;
    private Integer valoracionMinima;
    private Integer edadMinima;

    // TABLA USUARIO
    private String correo;
    private String contrasena;

}
