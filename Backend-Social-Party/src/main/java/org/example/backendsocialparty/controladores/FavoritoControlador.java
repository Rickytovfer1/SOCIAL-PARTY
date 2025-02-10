package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.FavoritoDTO;
import org.example.backendsocialparty.servicios.FavoritoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cliente")
@AllArgsConstructor
public class FavoritoControlador {

    private FavoritoServicio favoritoServicio;

    @GetMapping("/likes/{id}")
    public List<FavoritoDTO> listarLikes(@PathVariable int id) {
        return favoritoServicio.listarLikes(id);
    }

    @GetMapping("/likes/publicacion/{id}")
    public List<FavoritoDTO> listarLikesPublicacion(@PathVariable int id) {
        return favoritoServicio.listarLikesPublicacion(id);
    }

    @PostMapping("/like")
    public void darLike(@RequestBody FavoritoDTO favoritoDTO) {
        favoritoServicio.darLike(favoritoDTO);
    }

    @PostMapping("/dislike")
    public void quitarLike(@RequestBody FavoritoDTO favoritoDTO) {
        favoritoServicio.quitarLike(favoritoDTO);
    }

}
