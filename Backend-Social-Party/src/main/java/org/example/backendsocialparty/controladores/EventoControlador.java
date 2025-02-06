package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EventoDTO;
import org.example.backendsocialparty.servicios.EventoServicio;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class EventoControlador {

    private EventoServicio eventoServicio;

    @PostMapping(value = "/empresa/crear/evento", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void crearEventoEmpresa(@ModelAttribute EventoDTO eventoDTO,
                                   @RequestParam("imagenFile") MultipartFile foto) {
        eventoServicio.crearEvento(eventoDTO, foto);
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
