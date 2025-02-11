package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EditarEstrellaDTO;
import org.example.backendsocialparty.DTOs.EmpresaDTO;
import org.example.backendsocialparty.DTOs.UsuarioDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.servicios.ClienteServicio;
import org.example.backendsocialparty.servicios.EmpresaServicio;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminControlador {

    private ClienteServicio clienteServicio;
    private EmpresaServicio empresaServicio;
    private UsuarioServicio usuarioServicio;

    @GetMapping("/listar/clientes")
    public List<ClienteDTO> listarClientes() {
        return clienteServicio.listarClientes();
    }

    @GetMapping("/listar/empresas")
    public List<EmpresaDTO> listarEmpresa(){
        return empresaServicio.listarEmpresas();
    }

    @GetMapping("/ver/cliente/{idCliente}")
    public ClienteDTO verCliente(@PathVariable Integer idCliente){
        return clienteServicio.buscarClienteId(idCliente);
    }

    @GetMapping("/ver/usuario/{idCliente}")
    public UsuarioDTO verUsuario(@PathVariable Integer idCliente){
        return usuarioServicio.buscarUsuarioPorCliente(idCliente);
    }

    @DeleteMapping("/eliminar/cliente/{idCliente}")
    public void eliminarCliente(@PathVariable Integer idCliente){
        clienteServicio.eliminarCliente(idCliente);
    }

    @PutMapping(value = "/actualizar/cliente", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ClienteDTO actualizarCliente(
            @RequestPart("cliente") ClienteDTO clienteDTO,
            @RequestPart(value = "fotoPerfil", required = false) MultipartFile fotoPerfil) {
        if (fotoPerfil != null && !fotoPerfil.isEmpty()){
            String urlFoto = clienteServicio.guardarFoto(fotoPerfil);
            clienteDTO.setFotoPerfil(urlFoto);
        }
        return clienteServicio.actualizarCliente(clienteDTO);
    }

    @PutMapping("/editar/estrellas")
    public void editarEstrella(@RequestBody EditarEstrellaDTO dto) {
        clienteServicio.modificarEstrella(dto);
    }

    @PostMapping("/banear/cliente/{idCliente}")
    public void banearCliente(@PathVariable Integer idCliente) {
        clienteServicio.banearCliente(idCliente);
    }

    @PutMapping("/eliminar/baneo/cliente/{idCliente}")
    public void desbanearCliente(@PathVariable Integer idCliente) {
        clienteServicio.eliminarBaneado(idCliente);
    }
}
