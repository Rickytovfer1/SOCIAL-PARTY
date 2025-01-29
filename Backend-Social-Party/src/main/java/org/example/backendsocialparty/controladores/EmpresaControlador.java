package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EmpresaDTO;
import org.example.backendsocialparty.DTOs.RestarPuntoDTO;
import org.example.backendsocialparty.servicios.ClienteServicio;
import org.example.backendsocialparty.servicios.EmpresaServicio;
import org.springframework.web.bind.annotation.*;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import java.util.List;
import org.example.backendsocialparty.modelos.Usuario;
@RestController
@RequestMapping()
@AllArgsConstructor
public class EmpresaControlador {

    private ClienteServicio clienteServicio;

    private EmpresaServicio empresaServicio;

    private UsuarioServicio usuarioServicio;

    @GetMapping("/empresa/buscar/{id}")
    public ClienteDTO buscarClienteId(@PathVariable Integer id) {
        return clienteServicio.buscarClienteId(id);
    }

    @GetMapping("/cliente/ver/empresas")
    public List<EmpresaDTO> listarEmpresa(){
        return empresaServicio.listarEmpresas();
    }

    @GetMapping("/empresa/perfil/{idUsuario}")
    public EmpresaDTO verPerfil(@PathVariable Integer idUsuario){
        return empresaServicio.verPerfilEmpresa(idUsuario);
    }

    @GetMapping("/empresa/ver/perfil/{correo}")
    public Usuario verUsuario(@PathVariable String correo){
        return (Usuario) usuarioServicio.loadUserByUsername(correo);
    }
    @PostMapping("/empresa/restar/puntos")
    public void restarPuntos(@RequestBody RestarPuntoDTO dto){
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
}
