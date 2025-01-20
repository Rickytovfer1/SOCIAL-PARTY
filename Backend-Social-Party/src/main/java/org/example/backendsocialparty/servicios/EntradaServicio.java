package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Entrada;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EntradaRepositorio;
import org.example.backendsocialparty.repositorios.EventoRepositorio;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class EntradaServicio {

    private EntradaRepositorio entradaRepositorio;
    private EventoRepositorio eventoRepositorio;
    private ClienteRepositorio clienteRepositorio;

    public void canjearEntrada(Entrada entrada) {

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
}
