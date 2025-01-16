package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.SolicitudDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Solicitud;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.SolicitudRepositorio;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SolicitudServicio {

    private SolicitudRepositorio solicitudRepositorio;
    private ClienteRepositorio clienteRepositorio;

    public Solicitud enviarSolicitud(SolicitudDTO dto) {

        Cliente usuario1 = clienteRepositorio.getReferenceById(dto.getIdUsuario1());
        Cliente usuario2 = clienteRepositorio.getReferenceById(dto.getIdUsuario2());

        Solicitud solicitud = new Solicitud();
        solicitud.setUsuario1(usuario1);
        solicitud.setUsuario2(usuario2);
        solicitud.setFecha(dto.getFechaSolicitud());

        return solicitudRepositorio.save(solicitud);
    }

    public void eliminarSolicitud(Integer idSolicitud) {
        solicitudRepositorio.deleteById(idSolicitud);
    }
}
