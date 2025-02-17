package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.security.UsuarioAdapter;
import org.example.backendsocialparty.servicios.ClienteServicio;
import org.example.backendsocialparty.servicios.EmpresaServicio;
import org.example.backendsocialparty.servicios.EventoServicio;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.example.backendsocialparty.modelos.Usuario;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
@AllArgsConstructor
public class EmpresaControlador {

    private final ClienteServicio clienteServicio;
    private final EmpresaServicio empresaServicio;
    private final UsuarioServicio usuarioServicio;
    private final EventoServicio eventoServicio;

    @GetMapping("/empresa/buscar/{id}")
    public ClienteDTO buscarClienteId(@PathVariable Integer id) {
        return clienteServicio.buscarClienteId(id);
    }

    @GetMapping("/cliente/ver/empresas")
    public List<EmpresaDTO> listarEmpresa(){
        return empresaServicio.listarEmpresas();
    }

    @GetMapping("/cliente/ver/{idEmpresa}")
    public EmpresaDTO buscarEmpresa(@PathVariable Integer idEmpresa){
        return empresaServicio.verEmpresa(idEmpresa);
    }

    @GetMapping("/empresa/perfil/{idUsuario}")
    public EmpresaDTO verPerfil(@PathVariable Integer idUsuario){
        return empresaServicio.verPerfilEmpresa(idUsuario);
    }


    @GetMapping("/empresa/ver/perfil/{correo}")
    public Usuario verUsuario(@PathVariable String correo){
        UserDetails userDetails = usuarioServicio.loadUserByUsername(correo);
        if (userDetails instanceof UsuarioAdapter) {
            return ((UsuarioAdapter) userDetails).getUsuario();
        }
        throw new RuntimeException("El usuario autenticado no es del tipo esperado.");
    }


    @PostMapping("/empresa/restar/puntos")
    public void restarPuntos(@RequestBody RestarPuntoDTO dto) {
        empresaServicio.restarPuntosCliente(dto);
    }



    @DeleteMapping("/empresa/eliminar/{idEmpresa}")
    public void eliminarEmpresa(@PathVariable Integer idEmpresa){
        empresaServicio.eliminarEmpresa(idEmpresa);
    }

    @DeleteMapping("/empresa/eliminar/cliente/{idCliente}")
    public void eliminarCliente(@PathVariable Integer idCliente){
        clienteServicio.eliminarCliente(idCliente);
    }

    @PutMapping(value = "/empresa/actualizar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public EmpresaDTO actualizarEmpresa(
            @RequestPart("empresa") EmpresaDTO empresaDTO,
            @RequestPart(value = "fotoPerfil", required = false) MultipartFile fotoPerfil) {
        if(fotoPerfil != null && !fotoPerfil.isEmpty()){
            String urlFoto = empresaServicio.guardarFoto(fotoPerfil);
            empresaDTO.setFotoPerfil(urlFoto);
        }
        return empresaServicio.actualizarEmpresa(empresaDTO);
    }


    @GetMapping("/empresa/ver/evento/hoy/{idEmpresa}")
    public EventoDTO verEventoHoy(@PathVariable Integer idEmpresa){
        return eventoServicio.obtenerEventoDeHoy(idEmpresa);
    }

    @PostMapping("/empresa/banear/{idCliente}/{idEmpresa}")
    public void banearDiscoteca(@PathVariable Integer idCliente, @PathVariable Integer idEmpresa){
        empresaServicio.banearDiscoteca(idCliente, idEmpresa);
    }

    @GetMapping("/cliente/ver/usuarios/{idEmpresa}")
    public UsuarioDTO verUsuarioEmpresa(@PathVariable Integer idEmpresa){
        return usuarioServicio.buscarUsuarioPorEmpresa(idEmpresa);
    }
}
