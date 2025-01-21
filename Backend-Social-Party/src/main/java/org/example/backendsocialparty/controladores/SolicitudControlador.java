package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.EliminarSolicitudDTO;
import org.example.backendsocialparty.DTOs.SolicitudDTO;
import org.example.backendsocialparty.modelos.Solicitud;
import org.example.backendsocialparty.servicios.SolicitudServicio;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cliente")
@AllArgsConstructor
public class SolicitudControlador {

    private SolicitudServicio solicitudServicio;

    @PostMapping("/solicitud")
    public void enviarSolicitud(@RequestBody SolicitudDTO dto) {
        solicitudServicio.enviarSolicitud(dto);
    }

    @DeleteMapping("/solicitud/eliminar")
    public void eliminarSolicitud(@RequestBody EliminarSolicitudDTO dto) {
        solicitudServicio.eliminarSolicitud(dto);
    }


}
