package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EmpresaDTO;
import org.example.backendsocialparty.DTOs.EventoDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.EventoRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.example.backendsocialparty.servicios.ClienteServicio.getClienteDTO;

@Service
@AllArgsConstructor
public class EventoServicio {

    private EventoRepositorio eventoRepositorio;
    private EmpresaRepositorio empresaRepositorio;

    public EventoDTO buscarEventoId(Integer id) {
        Evento evento = eventoRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));
        return getEventoDTO(evento);
    }

    public List<EventoDTO> listarEventosEmpresa(Integer idEmpresa) {
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));
        Set<Evento> eventos = empresa.getEventos();
        List<EventoDTO> eventosDTO = new ArrayList<>();
        for (Evento evento : eventos) {
            eventosDTO.add(getEventoDTO(evento));
        }
        return eventosDTO;
    }

    public List<ClienteDTO> listarClientesEvento(Integer idEvento) {
        Evento e = eventoRepositorio.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));;

        Set<Cliente> clientes = e.getAsistentes();
        List<ClienteDTO> clientesDTO = new ArrayList<>();
        for (Cliente cliente : clientes) {
            clientesDTO.add(getClienteDTO(cliente));
        }
        return clientesDTO;
    }

    public void crearEvento(EventoDTO eventoDTO) {

        Evento evento = new Evento();
        evento.setHoraApertura(eventoDTO.getHoraApertura());
        evento.setHoraFinalizacion(eventoDTO.getHoraFinalizacion());
        evento.setFecha(LocalDate.now());
        evento.setTitulo(eventoDTO.getTitulo());
        evento.setFoto(eventoDTO.getFoto());
        evento.setDescripcion(eventoDTO.getDescripcion());

        Empresa empresa = empresaRepositorio.findById(eventoDTO.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        evento.setEmpresa(empresa);

        eventoRepositorio.save(evento);

    }

    private static EventoDTO getEventoDTO(Evento e) {
        EventoDTO dtonuevo = new EventoDTO();

        dtonuevo.setId(e.getId());
        dtonuevo.setHoraApertura(e.getHoraApertura());
        dtonuevo.setHoraFinalizacion(e.getHoraFinalizacion());
        dtonuevo.setFecha(e.getFecha());
        dtonuevo.setTitulo(e.getTitulo());
        dtonuevo.setFoto(e.getFoto());
        dtonuevo.setDescripcion(e.getDescripcion());

        if (e.getEmpresa() != null) {
            dtonuevo.setIdEmpresa(e.getEmpresa().getId());
        }

        return dtonuevo;
    }

}
