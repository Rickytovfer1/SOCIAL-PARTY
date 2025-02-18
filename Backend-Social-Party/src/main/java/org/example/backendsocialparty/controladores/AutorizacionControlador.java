package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.LoginDTO;
import org.example.backendsocialparty.DTOs.RegistrarClienteDTO;
import org.example.backendsocialparty.DTOs.RegistrarEmpresaDTO;
import org.example.backendsocialparty.DTOs.RespuestaDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/autorizacion")
@AllArgsConstructor
public class AutorizacionControlador {

    private UsuarioServicio usuarioServicio;


    @PostMapping("/registro/cliente")
    public Usuario registroCliente(@RequestBody RegistrarClienteDTO registroDTO){
        return usuarioServicio.registrarCliente(registroDTO);
    }

    @PostMapping("/registro/empresa")
    public Usuario registroEmpresa(@RequestBody RegistrarEmpresaDTO registroDTO){
        return usuarioServicio.registrarEmpresa(registroDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<RespuestaDTO> registro(@RequestBody LoginDTO dto){
        return usuarioServicio.login(dto);
    }

}
