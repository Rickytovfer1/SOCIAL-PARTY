package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ComentarioDTO;
import org.example.backendsocialparty.DTOs.ComentarioEnvioDTO;
import org.example.backendsocialparty.servicios.ComentarioService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cliente")
@AllArgsConstructor
public class ComentarioControlador {

    private ComentarioService comentarioService;

    @PostMapping("/nuevo/comentario")
    public void comentar(@RequestBody ComentarioEnvioDTO comentarioDTO) {
        comentarioService.comentar(comentarioDTO);
    }
}
