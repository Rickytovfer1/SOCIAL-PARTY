package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EmpresaDTO;
import org.example.backendsocialparty.DTOs.RestarPuntoDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.servicios.ClienteServicio;
import org.example.backendsocialparty.servicios.EmpresaServicio;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/empresa/ver/empresa/{correo}")
    public Usuario verUsuario(@PathVariable String correo){
        return (Usuario) usuarioServicio.loadUserByUsername(correo);
    }
}
