package org.example.backendsocialparty.servicios;


import org.example.backendsocialparty.DTOs.MensajeDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Mensaje;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.MensajeRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class MensajeServicio {

    private final MensajeRepositorio mensajeRepositorio;
    private final ClienteRepositorio clienteRepositorio;

    public MensajeServicio(MensajeRepositorio mensajeRepositorio, ClienteRepositorio clienteRepositorio) {
        this.mensajeRepositorio = mensajeRepositorio;
        this.clienteRepositorio = clienteRepositorio;
    }

    public void enviarMensaje(MensajeDTO mensajeDTO) {

        Mensaje mensaje = new Mensaje();
        mensaje.setTexto(mensajeDTO.getTexto());
        mensaje.setHora(LocalTime.now());
        mensaje.setFecha(LocalDate.now());

        Cliente emisor = clienteRepositorio.findByUsuarioId(mensajeDTO.getIdEmisor())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este Usuario ID de emisor."));

        Cliente receptor = clienteRepositorio.findByUsuarioId(mensajeDTO.getIdReceptor())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este Usuario ID de receptor."));

        mensaje.setEmisor(emisor);
        mensaje.setReceptor(receptor);

        mensajeRepositorio.save(mensaje);
    }

    public List<MensajeDTO> mostrarConversacion(Integer idUsuarioEmisor, Integer idUsuarioReceptor) {

        // Convertir idUsuario a idCliente para el emisor
        Cliente clienteEmisor = clienteRepositorio.findByUsuarioId(idUsuarioEmisor)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este Usuario ID de emisor."));

        // Convertir idUsuario a idCliente para el receptor
        Cliente clienteReceptor = clienteRepositorio.findByUsuarioId(idUsuarioReceptor)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este Usuario ID de receptor."));

        Integer idEmisorCliente = clienteEmisor.getId();
        Integer idReceptorCliente = clienteReceptor.getId();

        // Realizar la consulta usando idCliente
        List<Mensaje> conversacion = mensajeRepositorio
                .findByEmisor_IdAndReceptor_IdOrEmisor_IdAndReceptor_IdOrderByFechaAscHoraAsc(
                        idEmisorCliente, idReceptorCliente, idReceptorCliente, idEmisorCliente);

        List<MensajeDTO> mensajesDTO = new ArrayList<>();

        for (Mensaje mensaje : conversacion) {
            mensajesDTO.add(getMensajeDTO(mensaje));
        }

        return mensajesDTO;
    }

    private MensajeDTO getMensajeDTO(Mensaje e) {
        MensajeDTO dtonuevo = new MensajeDTO();

        dtonuevo.setId(e.getId());
        dtonuevo.setTexto(e.getTexto());
        dtonuevo.setHora(e.getHora());
        dtonuevo.setFecha(e.getFecha());

        // Asignar idUsuario del emisor
        if (e.getEmisor() != null && e.getEmisor().getUsuario() != null) {
            dtonuevo.setIdEmisor(e.getEmisor().getUsuario().getId());
        } else {
            dtonuevo.setIdEmisor(null);
        }

        // Asignar idUsuario del receptor
        if (e.getReceptor() != null && e.getReceptor().getUsuario() != null) {
            dtonuevo.setIdReceptor(e.getReceptor().getUsuario().getId());
        } else {
            dtonuevo.setIdReceptor(null);
        }

        return dtonuevo;
    }

    public void eliminarMensaje(Integer id) {
        List<Mensaje> mensajes = mensajeRepositorio.findByReceptor_IdOrEmisor_Id(id, id);
        mensajeRepositorio.deleteAll(mensajes);
    }
}
