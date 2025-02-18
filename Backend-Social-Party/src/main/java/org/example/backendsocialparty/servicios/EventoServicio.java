package org.example.backendsocialparty.servicios;
import java.util.stream.Collectors;
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

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        List<Evento> eventosFiltrados = empresa.getEventos().stream()
                .filter(evento -> {
                    if (evento.getFecha().isAfter(hoy)) {
                        return true;
                    }
                    else if (evento.getFecha().isEqual(hoy)) {
                        return ahora.isBefore(evento.getHoraFinalizacion());
                    }
                    return false;
                })
                .sorted(Comparator.comparing(Evento::getFecha)
                        .thenComparing(Evento::getHoraApertura))
                .collect(Collectors.toList());

        return eventosFiltrados.stream()
                .map(evento -> getEventoDTO(evento))
                .collect(Collectors.toList());
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
        if (cliente.getEventos() != null && !cliente.getEventos().isEmpty()) {
            Evento evento = cliente.getEventos().iterator().next();
            evento.getAsistentes().remove(cliente);
            cliente.getEventos().remove(evento);
            eventoRepositorio.save(evento);
        }
    }

    public void eliminarEvento(Integer id) {
        List<Evento> eventos = eventoRepositorio.findByEmpresa_Id(id);

        for (Evento evento : eventos) {
            if (evento.getAsistentes() != null) {
                evento.getAsistentes().clear();
                eventoRepositorio.save(evento);
            }
        }
        eventoRepositorio.deleteAll(eventos);
    }

    public void eliminarBaneadoEmpresa(Integer id) {
        Empresa empresa = empresaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        empresa.getBaneados().clear();
        empresaRepositorio.save(empresa);
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

    public EventoDTO obtenerEventoDeHoy(Integer idEmpresa) {
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        Evento eventoFinalizado = null;

        for (Evento evento : empresa.getEventos()) {
            if (evento.getFecha().isEqual(hoy)) {

                if (!ahora.isBefore(evento.getHoraApertura()) && !ahora.isAfter(evento.getHoraFinalizacion())) {
                    return getEventoDTO(evento);
                }

                else if (ahora.isAfter(evento.getHoraFinalizacion())) {
                    eventoFinalizado = evento;
                    break;
                }
            }
        }

        if (eventoFinalizado != null) {

            for (Cliente cliente : new HashSet<>(eventoFinalizado.getAsistentes())) {
                cliente.getEventos().remove(eventoFinalizado);
                clienteRepositorio.save(cliente);
            }
            eventoFinalizado.getAsistentes().clear();

            empresa.getEventos().remove(eventoFinalizado);
            empresaRepositorio.save(empresa);

            eventoRepositorio.save(eventoFinalizado);
            eventoRepositorio.delete(eventoFinalizado);
        }

        return null;
    }



}
