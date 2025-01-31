package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.*;
import org.example.backendsocialparty.repositorios.AmistadRepositorio;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class ClienteServicio {

    private final ClienteRepositorio clienteRepositorio;

    private final PublicacionServicio publicacionServicio;

    private final MensajeServicio mensajeServicio;

    private final SolicitudServicio solicitudServicio;

    private final AmistadServicio amistadServicio;

    private final EventoServicio eventoServicio;

    private final EntradaServicio entradaServicio;
    private final UsuarioRepositorio usuarioRepositorio;

    public ClienteServicio(ClienteRepositorio clienteRepositorio, PublicacionServicio publicacionServicio,
                           MensajeServicio mensajeServicio, SolicitudServicio solicitudServicio,
                           @Lazy AmistadServicio amistadServicio, EventoServicio eventoServicio,
                           EntradaServicio entradaServicio, UsuarioRepositorio usuarioRepositorio) {
        this.clienteRepositorio = clienteRepositorio;
        this.publicacionServicio = publicacionServicio;
        this.mensajeServicio = mensajeServicio;
        this.solicitudServicio = solicitudServicio;
        this.amistadServicio = amistadServicio;
        this.eventoServicio = eventoServicio;
        this.entradaServicio = entradaServicio;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    public ClienteDTO buscarClienteId(Integer id) {
        Cliente cliente = clienteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        return getClienteDTO(cliente);
    }

    public ClienteDTO busccarClienteUsuarioID(Integer idUsuario){
        Cliente cliente = clienteRepositorio.findByUsuario_Id(idUsuario);
        return getClienteDTO(cliente);
    }

    public static ClienteDTO getClienteDTO(Cliente c) {
        ClienteDTO dtonuevo = new ClienteDTO();
        dtonuevo.setId(c.getId());
        dtonuevo.setNombre(c.getNombre());
        dtonuevo.setApellidos(c.getApellidos());
        dtonuevo.setDni(c.getDni());
        dtonuevo.setTelefono(c.getTelefono());
        dtonuevo.setFechaNacimiento(c.getFechaNacimiento());
        dtonuevo.setValoracion(c.getValoracion());
        dtonuevo.setBiografia(c.getBiografia());
        dtonuevo.setFotoPerfil(c.getFotoPerfil());

        if (c.getAmistades() != null) {
            Set<Integer> amigosDTO = new HashSet<>();
            for (Amistad a : c.getAmistades()) {
                amigosDTO.add(a.getId());
            }
            dtonuevo.setAmigos(amigosDTO);
        }

        if (c.getEntradas() != null) {
            Set<Integer> entradasDTO = new HashSet<>();
            for (Entrada e : c.getEntradas()) {
                entradasDTO.add(e.getId());
            }
            dtonuevo.setEntradas(entradasDTO);
        }

        if (c.getGrupos() != null) {
            Set<Integer> gruposDTO = new HashSet<>();
            for (Grupo g : c.getGrupos()) {
                gruposDTO.add(g.getId());
            }
            dtonuevo.setAmigos(gruposDTO);
        }

        if (c.getUsuario() != null) {
            dtonuevo.setIdUsuario(c.getUsuario().getId());
        }

        return dtonuevo;
    }

    public void eliminarCliente(Integer id){

        Cliente cliente = clienteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        entradaServicio.eliminarEntrada(id);
        eventoServicio.eliminarPersonaEvento(id);
        amistadServicio.eliminarAmistad(id);
        solicitudServicio.eliminarSolicitudCli(id);
        publicacionServicio.eliminarPublicacion(id);
        mensajeServicio.eliminarMensaje(id);
        clienteRepositorio.delete(cliente);

    }

    public ClienteDTO actualizarCliente(ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepositorio.findById(clienteDTO.getId())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        cliente.setNombre(clienteDTO.getNombre());
        cliente.setApellidos(clienteDTO.getApellidos());
        cliente.setDni(clienteDTO.getDni());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setFechaNacimiento(clienteDTO.getFechaNacimiento());
        cliente.setBiografia(clienteDTO.getBiografia());
        cliente.setFotoPerfil(clienteDTO.getFotoPerfil());

        Usuario usuario = cliente.getUsuario();
        if (usuario != null) {
            String nuevoCorreo = clienteDTO.getCorreo();
            if (nuevoCorreo != null && !nuevoCorreo.equals(usuario.getCorreo())) {
                Optional<Usuario> usuarioExistente = usuarioRepositorio.findTopByCorreo(nuevoCorreo);
                if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
                    throw new RuntimeException("El correo ya está en uso por otro usuario.");
                }
                usuario.setCorreo(nuevoCorreo);
                usuarioRepositorio.save(usuario);
            }
        } else {
            throw new RuntimeException("El cliente no está asociado a ningún usuario.");
        }

        Cliente clienteActualizado = clienteRepositorio.save(cliente);

        return getClienteDTO(clienteActualizado);
    }
}
