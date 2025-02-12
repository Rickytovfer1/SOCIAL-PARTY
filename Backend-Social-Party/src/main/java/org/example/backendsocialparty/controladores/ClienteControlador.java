package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.security.UsuarioAdapter;
import org.example.backendsocialparty.servicios.ClienteServicio;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

    @GetMapping("/verUsuario")
    public ResponseEntity<?> verUsuario() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario usuario;
        if (principal instanceof org.example.backendsocialparty.security.UsuarioAdapter) {
            usuario = ((org.example.backendsocialparty.security.UsuarioAdapter) principal).getUsuario();
        } else if (principal instanceof Usuario) {
            usuario = (Usuario) principal;
        } else {
            return ResponseEntity.badRequest().body("No se pudo obtener el usuario autenticado.");
        }
        return ResponseEntity.ok(usuario);
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
    @GetMapping("/ver/usuario/{correo}")
    public Usuario verUsuario(@PathVariable String correo){
        UserDetails userDetails = usuarioServicio.loadUserByUsername(correo);
        if (userDetails instanceof UsuarioAdapter) {
            return ((UsuarioAdapter) userDetails).getUsuario();
        }
        throw new RuntimeException("El usuario autenticado no es del tipo esperado.");
    }


}
