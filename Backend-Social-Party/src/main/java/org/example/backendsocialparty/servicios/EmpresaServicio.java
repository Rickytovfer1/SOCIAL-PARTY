package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EmpresaDTO;
import org.example.backendsocialparty.DTOs.RestarPuntoDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmpresaServicio {

    private EmpresaRepositorio empresaRepositorio;

    private ClienteRepositorio clienteRepositorio;

    private PublicacionServicio publicacionServicio;

    private MensajeServicio mensajeServicio;

    private SolicitudServicio solicitudServicio;

    private AmistadServicio amistadServicio;

    private EventoServicio eventoServicio;
    private UsuarioRepositorio usuarioRepositorio;

    private EntradaServicio entradaServicio;

    public List<EmpresaDTO> listarEmpresas() {
        List<Empresa> empresas = empresaRepositorio.findAll();
        List<EmpresaDTO> empresasDTO = new ArrayList<>();
        for (Empresa empresa : empresas) {
            empresasDTO.add(getEmpresaDTO(empresa));
        }
        return empresasDTO;
    }

    public void restarPuntosCliente(RestarPuntoDTO dto) {

        Cliente cliente = clienteRepositorio.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("No existe un liente con este ID."));

        cliente.setValoracion(cliente.getValoracion() - dto.getPuntos());

        clienteRepositorio.save(cliente);
    }

    private static EmpresaDTO getEmpresaDTO(Empresa e) {
        EmpresaDTO dtonuevo = new EmpresaDTO();

        dtonuevo.setId(e.getId());
        dtonuevo.setNombre(e.getNombre());
        dtonuevo.setDireccion(e.getDireccion());
        dtonuevo.setCp(e.getCodigoPostal());
        dtonuevo.setNif(e.getNif());
        dtonuevo.setFotoPerfil(e.getFotoPerfil());
        dtonuevo.setTelefono(e.getTelefono());
        dtonuevo.setValoracionMinima(e.getValoracionMinima());

        if (e.getEventos() != null) {
            Set<Integer> eventosDTO = new HashSet<>();
            for (Evento ev : e.getEventos()) {
                eventosDTO.add(ev.getId());
            }
            dtonuevo.setEventos(eventosDTO);
        }

        if (e.getUsuario() != null) {
            dtonuevo.setIdUsuario(e.getUsuario().getId());
        }

        return dtonuevo;
    }

    public void eliminarEmpresa(Integer id) {
        Empresa empresa = empresaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        eventoServicio.eliminarEvento(id);
        publicacionServicio.eliminarPublicacion(id);
        empresaRepositorio.delete(empresa);
    }
    public EmpresaDTO verPerfilEmpresa(Integer idUsuario){
        Empresa empresa = empresaRepositorio.findByUsuario_Id(idUsuario);
        return getEmpresaDTO(empresa);
    }


    public EmpresaDTO actualizarEmpresa(EmpresaDTO empresaDTO) {
        Empresa empresa = empresaRepositorio.findById(empresaDTO.getId())
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        if (empresaDTO.getNombre() != null) {
            empresa.setNombre(empresaDTO.getNombre());
        }
        if (empresaDTO.getDireccion() != null) {
            empresa.setDireccion(empresaDTO.getDireccion());
        }
        if (empresaDTO.getCp() != null) {
            empresa.setCodigoPostal(empresaDTO.getCp());
        }
        if (empresaDTO.getNif() != null) {
            empresa.setNif(empresaDTO.getNif());
        }
        if (empresaDTO.getTelefono() != null) {
            empresa.setTelefono(empresaDTO.getTelefono());
        }
        if (empresaDTO.getValoracionMinima() != null) {
            empresa.setValoracionMinima(empresaDTO.getValoracionMinima());
        }
        if (empresaDTO.getEdadMinima() != null) {
            empresa.setEdadMinima(empresaDTO.getEdadMinima());
        }
        if (empresaDTO.getFotoPerfil() != null) {
            empresa.setFotoPerfil(empresaDTO.getFotoPerfil());
        }

        Usuario usuario = empresa.getUsuario();
        if (usuario != null) {
            String nuevoCorreo = empresaDTO.getCorreo();
            if (nuevoCorreo != null && !nuevoCorreo.equals(usuario.getCorreo())) {
                Optional<Usuario> usuarioExistente = usuarioRepositorio.findTopByCorreo(nuevoCorreo);
                if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
                    throw new RuntimeException("El correo ya está en uso por otra empresa.");
                }
                usuario.setCorreo(nuevoCorreo);
                usuarioRepositorio.save(usuario);
            }
        } else {
            throw new RuntimeException("La empresa no está asociada a ningún usuario.");
        }

        Empresa empresaActualizada = empresaRepositorio.save(empresa);

        return getEmpresaDTO(empresaActualizada);
    }

}
