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

    public void enviarMensaje (MensajeDTO mensajeDTO) {

        Mensaje mensaje = new Mensaje();
        mensaje.setTexto(mensajeDTO.getTexto());
        mensaje.setHora(LocalTime.now());
        mensaje.setFecha(LocalDate.now());

        Cliente emisor = clienteRepositorio.findById(mensajeDTO.getIdEmisor())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        Cliente receptor = clienteRepositorio.findById(mensajeDTO.getIdReceptor())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        mensaje.setEmisor(emisor);
        mensaje.setReceptor(receptor);

        mensajeRepositorio.save(mensaje);
    }

    public List<MensajeDTO> mostrarConversacion(Integer idEmisor, Integer idReceptor) {

        List<Mensaje> mensajes = mensajeRepositorio.findAll();

        List<Mensaje> conversacion = new ArrayList<>();

        for (Mensaje mensaje : mensajes) {
            if (mensaje.getEmisor().getId() == idEmisor && mensaje.getReceptor().getId() == idReceptor
                || mensaje.getEmisor().getId() == idReceptor && mensaje.getReceptor().getId() == idEmisor) {
                conversacion.add(mensaje);
            }
        }

        List<MensajeDTO> mensajesDTO = new ArrayList<>();

        for (Mensaje mensaje : conversacion) {
            mensajesDTO.add(getMensajeDTO(mensaje));
        }

        mensajesDTO.sort(Comparator.comparing(MensajeDTO::getFecha).thenComparing(MensajeDTO::getHora));

        return mensajesDTO;
    }

    private static MensajeDTO getMensajeDTO(Mensaje e) {
        MensajeDTO dtonuevo = new MensajeDTO();

        dtonuevo.setId(e.getId());
        dtonuevo.setTexto(e.getTexto());
        dtonuevo.setHora(e.getHora());
        dtonuevo.setFecha(e.getFecha());
        dtonuevo.setIdEmisor(e.getEmisor().getId());
        dtonuevo.setIdReceptor(e.getReceptor().getId());

        return dtonuevo;
    }

    public void eliminarMensaje (Integer id) {

        List<Mensaje> mensajes = mensajeRepositorio.findByReceptor_IdOrEmisor_Id(id, id);
        mensajeRepositorio.deleteAll(mensajes);
    }
}
