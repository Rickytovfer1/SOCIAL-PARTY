package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.MensajeDTO;
import org.example.backendsocialparty.servicios.MensajeServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cliente/mensaje")
@AllArgsConstructor
public class MensajeControlador {

    private MensajeServicio mensajeServicio;

    @PostMapping("/enviar")
    public void enviarMensaje(@RequestBody MensajeDTO dto){
        mensajeServicio.enviarMensaje(dto);
    }

    @GetMapping("/ver/{idEmisor}/{idReceptor}")
    public List<MensajeDTO> verMensajes(@PathVariable Integer idEmisor, @PathVariable Integer idReceptor){
        return mensajeServicio.mostrarConversacion(idEmisor, idReceptor);
    }

}
