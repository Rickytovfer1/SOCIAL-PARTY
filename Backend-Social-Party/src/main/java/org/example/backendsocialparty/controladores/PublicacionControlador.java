package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClientePublicacionDTO;
import org.example.backendsocialparty.DTOs.PublicacionDTO;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.servicios.PublicacionServicio;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping()
@AllArgsConstructor
public class PublicacionControlador {

    private PublicacionServicio publicacionServicio;

    @PostMapping("/cliente/crear/publicacion")
    public Publicacion guardarPublicacionCliente(@RequestBody ClientePublicacionDTO dto) {
        return publicacionServicio.guardarPublicacionCliente(dto);
    }

    @PostMapping("/empresa/crear/publicacion")
    public Publicacion guardarPublicacionEmpresa(@RequestBody PublicacionDTO dto) {
        return publicacionServicio.guardarPublicacion(dto);
    }
}
