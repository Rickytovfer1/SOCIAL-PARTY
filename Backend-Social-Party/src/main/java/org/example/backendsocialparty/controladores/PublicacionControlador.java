package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClientePublicacionDTO;
import org.example.backendsocialparty.DTOs.MostrarPublicacionDTO;
import org.example.backendsocialparty.DTOs.PublicacionDTO;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.servicios.PublicacionServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class PublicacionControlador {

    private PublicacionServicio publicacionServicio;

    @PostMapping("/cliente/crear/publicacion")
    public void guardarPublicacionCliente(@RequestBody ClientePublicacionDTO dto) {
        publicacionServicio.guardarPublicacionCliente(dto);
    }

    @PostMapping("/empresa/crear/publicacion")
    public void guardarPublicacionEmpresa(@RequestBody PublicacionDTO dto) {
        publicacionServicio.guardarPublicacion(dto);
    }

    @GetMapping("/cliente/ver/publicaciones")
    public List<MostrarPublicacionDTO> mostrarPublicaciones() {
        return publicacionServicio.mostrarPublicaciones();
    }
}
