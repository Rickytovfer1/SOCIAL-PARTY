package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.EliminarSolicitudDTO;
import org.example.backendsocialparty.DTOs.SolicitudDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Solicitud;
import org.example.backendsocialparty.repositorios.AmistadRepositorio;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.SolicitudRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SolicitudServicio {

    private SolicitudRepositorio solicitudRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private final AmistadRepositorio amistadRepositorio;
    private final WebSocketSolicitudService webSocketSolicitudService;
    public void enviarSolicitud(SolicitudDTO dto) {
        Cliente usuario1 = clienteRepositorio.findByUsuarioId(dto.getIdUsuario1())
                .orElseThrow(() -> new RuntimeException("No existe cliente para el Usuario ID " + dto.getIdUsuario1()));
        Cliente usuario2 = clienteRepositorio.findByUsuarioId(dto.getIdUsuario2())
                .orElseThrow(() -> new RuntimeException("No existe cliente para el Usuario ID " + dto.getIdUsuario2()));
        boolean yaSonAmigos = amistadRepositorio.existsByUsuario_IdAndAmigo_Id(usuario1.getId(), usuario2.getId()) ||
                amistadRepositorio.existsByUsuario_IdAndAmigo_Id(usuario2.getId(), usuario1.getId());
        if (yaSonAmigos) {
            throw new RuntimeException("Ya son amigos, no se puede enviar solicitud");
        }
        boolean yaExisteSolicitud = solicitudRepositorio.existsByUsuario1_IdAndUsuario2_Id(usuario1.getId(), usuario2.getId());
        if (yaExisteSolicitud) {
            throw new RuntimeException("Ya se ha enviado una solicitud a este usuario");
        }
        Solicitud solicitud = new Solicitud();
        solicitud.setUsuario1(usuario1);
        solicitud.setUsuario2(usuario2);
        solicitud.setFecha(LocalDate.now().atStartOfDay());
        solicitudRepositorio.save(solicitud);
        
        SolicitudDTO solicitudDTO = new SolicitudDTO(
                solicitud.getId(),
                solicitud.getUsuario1().getUsuario().getId(),
                solicitud.getUsuario2().getUsuario().getId()
        );
        webSocketSolicitudService.enviarSolicitudCreada(solicitudDTO);
    }


    public void eliminarSolicitud(EliminarSolicitudDTO dto)

    {
        solicitudRepositorio.deleteById(dto.getIdSolicitud());
    }

    public void eliminarSolicitudCli(Integer id) {
        List<Solicitud> solicitudes = solicitudRepositorio.findByUsuario1_IdOrUsuario2_Id(id, id);
        solicitudRepositorio.deleteAll(solicitudes);
    }

    public List<SolicitudDTO> obtenerSolicitudes(Integer idUsuario) {
        Cliente cliente = clienteRepositorio.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado para Usuario ID: " + idUsuario));

        List<Solicitud> solicitudes = solicitudRepositorio.findByUsuario2_Id(cliente.getId());

        return solicitudes.stream()
                .map(solicitud -> new SolicitudDTO(
                        solicitud.getId(),
                        solicitud.getUsuario1().getUsuario().getId(),
                        solicitud.getUsuario2().getUsuario().getId()
                ))
                .collect(Collectors.toList());
    }
}
