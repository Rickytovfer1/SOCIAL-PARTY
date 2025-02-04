package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.servicios.ClienteServicio;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/cliente")
@AllArgsConstructor
public class ClienteControlador {

    private ClienteServicio clienteServicio;

    private UsuarioServicio usuarioServicio;

    @GetMapping("/buscar/{id}")
    public ClienteDTO buscarClienteId(@PathVariable Integer id) {
        return clienteServicio.buscarClienteId(id);
    }

    @DeleteMapping("/eliminar/{idCliente}")
    public void eliminarCliente(@PathVariable Integer idCliente){
        clienteServicio.eliminarCliente(idCliente);
    }

    @GetMapping("/ver/usuario/{correo}")
    public Usuario verUsuario(@PathVariable String correo){
        return (Usuario) usuarioServicio.loadUserByUsername(correo);
    }

    @GetMapping("/ver/perfil/{idUsuario}")
    public ClienteDTO buscarClienteUsuarioId(@PathVariable Integer idUsuario){
        return clienteServicio.busccarClienteUsuarioID(idUsuario);
    }
    @PutMapping(value = "/actualizar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ClienteDTO actualizarCliente(
            @RequestPart("cliente") ClienteDTO clienteDTO,
            @RequestPart(value = "fotoPerfil", required = false) MultipartFile fotoPerfil) {
        if (fotoPerfil != null && !fotoPerfil.isEmpty()){
            String urlFoto = clienteServicio.guardarFoto(fotoPerfil);
            clienteDTO.setFotoPerfil(urlFoto);
        }
        return clienteServicio.actualizarCliente(clienteDTO);
    }
}
