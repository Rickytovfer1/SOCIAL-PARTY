package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.EliminarSolicitudDTO;
import org.example.backendsocialparty.DTOs.SolicitudDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Solicitud;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.SolicitudRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class SolicitudServicio {

    private SolicitudRepositorio solicitudRepositorio;
    private ClienteRepositorio clienteRepositorio;

    public void enviarSolicitud(SolicitudDTO dto) {

        Cliente usuario1 = clienteRepositorio.findById(dto.getIdUsuario1()).orElse(null);
        Cliente usuario2 = clienteRepositorio.findById(dto.getIdUsuario2()).orElse(null);

        Solicitud solicitud = new Solicitud();
        solicitud.setUsuario1(usuario1);
        solicitud.setUsuario2(usuario2);
        solicitud.setFecha(LocalDateTime.now());

        solicitudRepositorio.save(solicitud);
    }

    public void eliminarSolicitud(EliminarSolicitudDTO dto) {
        solicitudRepositorio.deleteById(dto.getIdSolicitud());
    }
}
