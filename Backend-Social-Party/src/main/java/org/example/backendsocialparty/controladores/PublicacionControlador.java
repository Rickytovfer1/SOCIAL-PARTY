package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClientePublicacionDTO;
import org.example.backendsocialparty.DTOs.MostrarPublicacionDTO;
import org.example.backendsocialparty.DTOs.PublicacionDTO;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.servicios.PublicacionServicio;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class PublicacionControlador {

    private PublicacionServicio publicacionServicio;

    @PostMapping(value = "/cliente/crear/publicacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void guardarPublicacionCliente(@ModelAttribute ClientePublicacionDTO dto,
                                          @RequestParam("foto") MultipartFile foto) {
        publicacionServicio.guardarPublicacionCliente(dto, foto);
    }

    @PostMapping(value = "/empresa/crear/publicacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void guardarPublicacionEmpresa(@ModelAttribute PublicacionDTO dto,
                                          @RequestParam("foto") MultipartFile foto) {
        publicacionServicio.guardarPublicacion(dto, foto);
    }

    @GetMapping("/cliente/ver/publicaciones")
    public List<MostrarPublicacionDTO> mostrarPublicaciones() {
        return publicacionServicio.mostrarPublicaciones();
    };

    @GetMapping("/empresa/publicaciones-empresa/{idUsuario}")
    public List<MostrarPublicacionDTO> mostrarPublicacionesEmpresa(@PathVariable Integer idUsuario) {
        return publicacionServicio.mostrarPublicacionesPorEmpresa(idUsuario);
    }
    @GetMapping("/feed/{idUsuario}")
    public List<MostrarPublicacionDTO> mostrarFeed(@PathVariable Integer idUsuario) {
        return publicacionServicio.mostrarPublicacionesFeed(idUsuario);
    }
}


