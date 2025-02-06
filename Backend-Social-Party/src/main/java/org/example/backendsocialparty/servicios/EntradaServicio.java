package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Entrada;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.EntradaRepositorio;
import org.example.backendsocialparty.repositorios.EventoRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class EntradaServicio {

    private EntradaRepositorio entradaRepositorio;
    private EventoRepositorio eventoRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private EmpresaRepositorio empresaRepositorio;

    public void canjearEntrada(Integer idEntrada) {

        Entrada entrada = entradaRepositorio.findById(idEntrada)
                .orElseThrow(() -> new RuntimeException("No existe una entrada con este ID."));

        Cliente cliente = clienteRepositorio.findById(entrada.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        Evento evento = eventoRepositorio.findById(entrada.getEvento().getId())
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));

        if (!evento.getAsistentes().contains(cliente) || !cliente.getEvento().equals(evento)) {

            evento.getAsistentes().add(cliente);
            cliente.setEvento(evento);

            clienteRepositorio.save(cliente);
            entradaRepositorio.save(entrada);
        }
    }

    public void comprarEntrada(Integer idEvento, Integer idEmpresa, Integer idCliente) {

        Cliente cliente = clienteRepositorio.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));
        Evento evento = eventoRepositorio.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));

        Period periodo = Period.between(cliente.getFechaNacimiento(), LocalDate.now());
        int edad = periodo.getYears();

        if (empresa.getEdadMinima() > edad || empresa.getBaneados().contains(cliente) || empresa.getValoracionMinima() > cliente.getValoracion()) {
            throw new RuntimeException("El cliente no es apto para entrar.");
        }

        Entrada entrada = new Entrada();
        entrada.setFecha(LocalDateTime.now());
        entrada.setCliente(cliente);
        entrada.setEvento(evento);

        entradaRepositorio.save(entrada);
    }

    public void eliminarEntrada(Integer id) {
        List<Entrada> entradas = entradaRepositorio.findByCliente_Id(id);
        entradaRepositorio.deleteAll(entradas);
    }

    public List<EntradaDTO> listarEntradas(Integer idCliente) {
        List<Entrada> entradas = entradaRepositorio.findByCliente_Id(idCliente);
        List<EntradaDTO> entradaDTOS = new ArrayList<>();
        for (Entrada entrada : entradas) {
            entradaDTOS.add(getEntradaDTO(entrada));
        }
        return entradaDTOS;
    }

    private static EntradaDTO getEntradaDTO(Entrada a) {
        EntradaDTO dtonuevo = new EntradaDTO();
        dtonuevo.setId(a.getId());
        dtonuevo.setFecha(a.getFecha());

        ClienteDTO dto = new ClienteDTO();
        dto.setId(a.getCliente().getId());
        dtonuevo.setCliente(dto);


        dtonuevo.setEvento(getEventoEntradaDTO(a.getEvento()));
        return dtonuevo;
    }

    private static EventoEntradaDTO getEventoEntradaDTO(Evento evento) {
        EventoEntradaDTO dto = new EventoEntradaDTO();
        dto.setId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setEmpresa(getEmpresaEntradaDTO(evento.getEmpresa()));
        return dto;
    }

    private static EmpresaEntradaDTO getEmpresaEntradaDTO(Empresa empresa) {
        EmpresaEntradaDTO dto = new EmpresaEntradaDTO();
        dto.setId(empresa.getId());
        dto.setNombre(empresa.getNombre());
        dto.setFotoPerfil(empresa.getFotoPerfil());
        return dto;
    }
}
