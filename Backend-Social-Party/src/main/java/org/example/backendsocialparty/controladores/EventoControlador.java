package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EventoDTO;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.servicios.EventoServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class EventoControlador {

    private EventoServicio eventoServicio;

    @PostMapping("/empresa/crear/evento")
    public void crearEvento(@RequestBody EventoDTO eventoDTO) {
        eventoServicio.crearEvento(eventoDTO);
    }

    @GetMapping("/cliente/ver/evento/{idEmpresa}")
    public List<EventoDTO> verEventoEmpresa(@PathVariable Integer idEmpresa) {
        return eventoServicio.listarEventosEmpresa(idEmpresa);
    }

    @GetMapping("/cliente/evento/ver/personas/{idEvento}")
    public List<ClienteDTO> verPersonasEvento(@PathVariable Integer idEvento) {
        return eventoServicio.listarClientesEvento(idEvento);
    }

    @GetMapping("/cliente/evento/ver/{idEvento}")
    public EventoDTO buscarEventoId(@PathVariable Integer idEvento) {
        return eventoServicio.buscarEventoId(idEvento);
    }
}
