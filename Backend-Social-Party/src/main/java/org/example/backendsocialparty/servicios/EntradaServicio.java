package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
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

@Service
@AllArgsConstructor
public class EntradaServicio {

    private EntradaRepositorio entradaRepositorio;
    private EventoRepositorio eventoRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private EmpresaRepositorio empresaRepositorio;

    public void canjearEntrada(Integer idEntrada) throws Exception {

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
}
