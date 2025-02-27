package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
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

    private final PublicacionRepositorio publicacionRepositorio;
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
    @GetMapping("/cliente/publicacion/{idUsuario}")
    public Rol comprobarRol(@PathVariable Integer idUsuario) {
        return publicacionServicio.comprobarRol(idUsuario);
    }
    @GetMapping("/feed/{idUsuario}")
    public List<MostrarPublicacionDTO> mostrarFeed(@PathVariable Integer idUsuario) {
        return publicacionServicio.mostrarPublicacionesFeed(idUsuario);
    }
    @GetMapping("/publicacion/{id}")
    public MostrarPublicacionDTO getPublicacion(@PathVariable Integer id) {
        Publicacion publicacion = publicacionRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicacion no encontrada"));
        return PublicacionServicio.getPublicacionDTO(publicacion);
    }

    @GetMapping("/ver/comentarios/publicacion/{idPublicacion}")
    public List<ComentarioDTO> verComentariosPublicacion(@PathVariable int idPublicacion){
        return publicacionServicio.listarComentarios(idPublicacion);
    }

}


