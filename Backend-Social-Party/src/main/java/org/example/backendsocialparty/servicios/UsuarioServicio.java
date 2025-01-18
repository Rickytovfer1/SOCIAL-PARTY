package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.RegistrarClienteDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.security.JWTService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UsuarioServicio {

    private UsuarioRepositorio usuarioRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private final PasswordEncoder passwordEncoder;
    private JWTService jwtService;

    public Usuario registrarCliente(RegistrarClienteDTO dto){
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setCorreo(dto.getUsername());
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        nuevoUsuario.setRol(Rol.PERFIL);


    }

}
