package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.AmistadDTO;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.servicios.AmistadServicio;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/amigos/aceptar/{idUsuario}/{idUsuario2}")
    public void aceptarSolicitud(@PathVariable Integer idUsuario, @PathVariable Integer idUsuario2) {
        amistadServicio.aceptarSolicitud(idUsuario, idUsuario2);
    }

    @PostMapping("/amigo/eliminar/{idUsuario}/{idAmigo}")
    public void eliminarAmigo(@PathVariable Integer idUsuario, @PathVariable Integer idAmigo) {
        amistadServicio.eliminarAmigo(idUsuario, idAmigo);
    }

}
