package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Amistad;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.repositorios.AmistadRepositorio;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AmistadServicio {

    private final AmistadRepositorio amistadRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final ClienteServicio clienteServicio;

    public AmistadServicio(AmistadRepositorio amistadRepositorio, ClienteRepositorio clienteRepositorio, ClienteServicio clienteServicio) {
        this.amistadRepositorio = amistadRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.clienteServicio = clienteServicio;
    }

    public List<ClienteDTO> getAmistad(Integer idUsuario) {

        if (!clienteRepositorio.existsById(idUsuario)) {
            throw new RuntimeException("No existe un cliente con este ID.");
        }

        Cliente cliente = clienteRepositorio.findById(idUsuario).get();

        List<ClienteDTO> clientesDTOs = new ArrayList<>();
        for (Amistad a : cliente.getAmistades()) {
            Cliente c = clienteRepositorio.findById(a.getAmigo().getId()).get();
            ClienteDTO dto = clienteServicio.getClienteDTO(c);
            clientesDTOs.add(dto);
        }

        return clientesDTOs;

    }

    public Amistad aceptarSolicitud(Integer idUsuario, Integer idUsuario2){
        Cliente usuario = clienteRepositorio.getReferenceById(idUsuario);
        Cliente amigo = clienteRepositorio.getReferenceById(idUsuario2);

        Amistad amistad = new Amistad();
        amistad.setUsuario(usuario);
        amistad.setAmigo(amigo);

        return amistadRepositorio.save(amistad);

    }


}
