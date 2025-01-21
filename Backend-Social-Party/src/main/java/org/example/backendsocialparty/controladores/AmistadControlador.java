package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Amistad;
import org.example.backendsocialparty.servicios.AmistadServicio;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cliente")
@AllArgsConstructor
public class AmistadControlador {

    private AmistadServicio amistadServicio;

    @GetMapping("/amigos/{idUsuario}")
    public List<ClienteDTO> getAmistad(@PathVariable Integer idUsuario) {
        return amistadServicio.getAmistad(idUsuario);
    }

    @GetMapping("/amigos/aceptar/{idUsuario}/{idUsuario2}")
    public Amistad aceptarSolicitud(@PathVariable Integer idUsuario, @PathVariable Integer idUsuario2) {
        return amistadServicio.aceptarSolicitud(idUsuario, idUsuario2);
    }


}
