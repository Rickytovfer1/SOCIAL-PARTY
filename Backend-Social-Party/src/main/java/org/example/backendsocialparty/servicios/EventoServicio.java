package org.example.backendsocialparty.servicios;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EventoDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.EventoRepositorio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import static org.example.backendsocialparty.servicios.ClienteServicio.getClienteDTO;

@Service
@RequiredArgsConstructor
public class EventoServicio {

    private final ClienteRepositorio clienteRepositorio;
    private final EventoRepositorio eventoRepositorio;
    private final EmpresaRepositorio empresaRepositorio;

    @Value("${upload.dir}")
    private String uploadDir;

    public EventoDTO buscarEventoId(Integer id) {
        Evento evento = eventoRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));
        return getEventoDTO(evento);
    }

    public List<EventoDTO> listarEventosEmpresa(Integer idEmpresa) {
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));
        Set<Evento> eventos = empresa.getEventos();
        if (eventos.isEmpty()) {
            eventos = new HashSet<>();
        }
        List<EventoDTO> eventosDTO = new ArrayList<>();
        for (Evento evento : eventos) {
            eventosDTO.add(getEventoDTO(evento));
        }
        return eventosDTO;
    }

    public List<ClienteDTO> listarClientesEvento(Integer idEvento) {
        Evento e = eventoRepositorio.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));
        Set<Cliente> clientes = e.getAsistentes();
        List<ClienteDTO> clientesDTO = new ArrayList<>();
        for (Cliente cliente : clientes) {
            clientesDTO.add(getClienteDTO(cliente));
        }
        return clientesDTO;
    }

    public void crearEvento(EventoDTO eventoDTO, MultipartFile foto) {
        Evento evento = (eventoDTO.getId() != null)
                ? eventoRepositorio.findById(eventoDTO.getId()).orElse(new Evento())
                : new Evento();

        evento.setHoraApertura(eventoDTO.getHoraApertura());
        evento.setHoraFinalizacion(eventoDTO.getHoraFinalizacion());
        evento.setFecha(eventoDTO.getFecha() != null ? eventoDTO.getFecha() : LocalDate.now());
        evento.setTitulo(eventoDTO.getTitulo());
        evento.setDescripcion(eventoDTO.getDescripcion());
        evento.setPrecio(eventoDTO.getPrecio());

        String fotoUrl = guardarImagen(foto);
        evento.setFoto(fotoUrl);
        Integer idUsuario = eventoDTO.getIdEmpresa();
        Empresa empresa = empresaRepositorio.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con usuario_id " + idUsuario));
        evento.setEmpresa(empresa);

        eventoRepositorio.save(evento);
    }

    private String guardarImagen(MultipartFile foto) {
        if (foto.isEmpty()) {
            return null;
        }
        String extension = getFileExtension(foto.getOriginalFilename());
        String filename = UUID.randomUUID().toString() + "." + extension;
        Path path = Paths.get(uploadDir, filename);
        try {
            Files.createDirectories(path.getParent());
            Files.copy(foto.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int lastIndex = filename.lastIndexOf(".");
        return (lastIndex == -1) ? "" : filename.substring(lastIndex + 1);
    }

    private static EventoDTO getEventoDTO(Evento e) {
        EventoDTO dtonuevo = new EventoDTO();
        dtonuevo.setId(e.getId());
        dtonuevo.setHoraApertura(e.getHoraApertura());
        dtonuevo.setHoraFinalizacion(e.getHoraFinalizacion());
        dtonuevo.setFecha(e.getFecha());
        dtonuevo.setTitulo(e.getTitulo());
        dtonuevo.setDescripcion(e.getDescripcion());
        dtonuevo.setFoto(e.getFoto());
        dtonuevo.setPrecio(e.getPrecio());
        if (e.getEmpresa() != null) {
            dtonuevo.setIdEmpresa(e.getEmpresa().getId());
        }
        return dtonuevo;
    }

    public void eliminarPersonaEvento(Integer id) {
        Cliente cliente = clienteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado."));
        if (cliente.getEvento() != null) {
            Evento evento = cliente.getEvento();
            evento.getAsistentes().remove(cliente);
            eventoRepositorio.save(evento);
        }
    }

    public void eliminarEvento(Integer id) {
        List<Evento> eventos = eventoRepositorio.findByEmpresa_Id(id);
        eventoRepositorio.deleteAll(eventos);
    }
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void finalizarEventos() {
        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        List<Evento> eventosFinalizados = eventoRepositorio.findByFechaAndHoraFinalizacionBefore(hoy, ahora);
        for (Evento evento : eventosFinalizados) {
            for (Cliente cliente : new HashSet<>(evento.getAsistentes())) {
                cliente.setValoracion(cliente.getValoracion() + 5);
                evento.removerAsistente(cliente);
                clienteRepositorio.save(cliente);
            }
            evento.getAsistentes().clear();
            eventoRepositorio.save(evento);
        }
    }


}
