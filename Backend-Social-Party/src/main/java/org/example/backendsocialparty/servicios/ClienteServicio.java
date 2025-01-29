package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Amistad;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Entrada;
import org.example.backendsocialparty.modelos.Grupo;
import org.example.backendsocialparty.repositorios.AmistadRepositorio;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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


    public ClienteServicio(ClienteRepositorio clienteRepositorio, PublicacionServicio publicacionServicio,
                           MensajeServicio mensajeServicio, SolicitudServicio solicitudServicio,
                           @Lazy AmistadServicio amistadServicio, EventoServicio eventoServicio,
                           EntradaServicio entradaServicio) {
        this.clienteRepositorio = clienteRepositorio;
        this.publicacionServicio = publicacionServicio;
        this.mensajeServicio = mensajeServicio;
        this.solicitudServicio = solicitudServicio;
        this.amistadServicio = amistadServicio;
        this.eventoServicio = eventoServicio;
        this.entradaServicio = entradaServicio;
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
}
