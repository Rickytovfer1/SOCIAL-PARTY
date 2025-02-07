package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.TipoUsuarioDTO;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@AllArgsConstructor
public class UsuarioControlador {

    private final UsuarioRepositorio usuarioRepositorio;
    private final EmpresaRepositorio empresaRepositorio;
    private final ClienteRepositorio clienteRepositorio;

    @GetMapping("/tipo/{idUsuario}")
    public ResponseEntity<?> obtenerTipoUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        }

        if (usuario.getRol().equals(Rol.EMPRESA)) {
            Empresa empresa = empresaRepositorio.findByUsuario_Id(idUsuario);
            if (empresa != null) {
                return ResponseEntity.ok(new TipoUsuarioDTO("empresa", empresa.getNombre()));
            }
        } else if (usuario.getRol().equals(Rol.CLIENTE)) {
            Cliente cliente = clienteRepositorio.findByUsuario_Id(idUsuario);
            if (cliente != null) {
                return ResponseEntity.ok(new TipoUsuarioDTO("cliente", cliente.getNombre()));
            }
        }
        return ResponseEntity.badRequest().body("Tipo de usuario no reconocido o datos incompletos");
    }
}
