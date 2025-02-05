package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.MensajeDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Mensaje;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.MensajeRepositorio;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MensajeServicio {
    private final MensajeRepositorio mensajeRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final WebSocketMensajeService webSocketMensajeService;
    public MensajeServicio(MensajeRepositorio mensajeRepositorio, ClienteRepositorio clienteRepositorio, WebSocketMensajeService webSocketMensajeService) {
        this.mensajeRepositorio = mensajeRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.webSocketMensajeService = webSocketMensajeService;
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
        MensajeDTO mensajeEnviado = getMensajeDTO(mensaje);
        webSocketMensajeService.enviarMensaje(mensajeEnviado);
    }
    public List<MensajeDTO> mostrarConversacion(Integer idUsuarioEmisor, Integer idUsuarioReceptor) {
        Cliente clienteEmisor = clienteRepositorio.findByUsuarioId(idUsuarioEmisor)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este Usuario ID de emisor."));
        Cliente clienteReceptor = clienteRepositorio.findByUsuarioId(idUsuarioReceptor)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este Usuario ID de receptor."));
        Integer idEmisorCliente = clienteEmisor.getId();
        Integer idReceptorCliente = clienteReceptor.getId();
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
        dtonuevo.setEditado(e.isEditado());
        dtonuevo.setBorrado(e.isBorrado());
        if (e.getEmisor() != null && e.getEmisor().getUsuario() != null) {
            dtonuevo.setIdEmisor(e.getEmisor().getUsuario().getId());
        } else {
            dtonuevo.setIdEmisor(null);
        }
        if (e.getReceptor() != null && e.getReceptor().getUsuario() != null) {
            dtonuevo.setIdReceptor(e.getReceptor().getUsuario().getId());
        } else {
            dtonuevo.setIdReceptor(null);
        }
        return dtonuevo;
    }
    public MensajeDTO editarMensaje(Integer id, String nuevoTexto) {
        Mensaje mensaje = mensajeRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setTexto(nuevoTexto);
        mensaje.setEditado(true);
        mensajeRepositorio.save(mensaje);
        return getMensajeDTO(mensaje);
    }
    public MensajeDTO eliminarMensaje(Integer id) {
        Mensaje mensaje = mensajeRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setTexto("Este mensaje ha sido borrado");
        mensaje.setBorrado(true);
        mensajeRepositorio.save(mensaje);
        return getMensajeDTO(mensaje);
    }
}
