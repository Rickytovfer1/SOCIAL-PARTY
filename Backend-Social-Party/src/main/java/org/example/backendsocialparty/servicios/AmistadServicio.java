package org.example.backendsocialparty.servicios;

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
import java.util.stream.Collectors;

@Service
public class AmistadServicio {

    private final AmistadRepositorio amistadRepositorio;
    private final ClienteRepositorio clienteRepositorio;

    public AmistadServicio(AmistadRepositorio amistadRepositorio, ClienteRepositorio clienteRepositorio) {
        this.amistadRepositorio = amistadRepositorio;
        this.clienteRepositorio = clienteRepositorio;
    }

    public List<ClienteDTO> getAmistad(Integer idUsuario) {
        if (!clienteRepositorio.existsByUsuarioId(idUsuario)) {
            throw new RuntimeException("No existe un cliente asociado a este Usuario ID.");
        }

        Cliente cliente = clienteRepositorio.findByUsuario_Id(idUsuario);

        List<Amistad> amistades = amistadRepositorio.findAllByUsuario_IdOrAmigo_Id(cliente.getId(), cliente.getId());

        Set<Integer> amigosIds = new HashSet<>();
        for (Amistad a : amistades) {
            amigosIds.add(a.getUsuario().getId());
            amigosIds.add(a.getAmigo().getId());
        }

        amigosIds.remove(cliente.getId());

        List<Cliente> amigos = clienteRepositorio.findAllById(amigosIds);

        return amigos.stream()
                .map(ClienteServicio::getClienteDTO)
                .collect(Collectors.toList());
    }


    public Amistad aceptarSolicitud(Integer idUsuario, Integer idUsuario2) {
        Cliente usuario = clienteRepositorio.getReferenceById(idUsuario);
        Cliente amigo = clienteRepositorio.getReferenceById(idUsuario2);

        Amistad amistad = new Amistad();
        amistad.setUsuario(usuario);
        amistad.setAmigo(amigo);

        return amistadRepositorio.save(amistad);
    }

    public void eliminarAmistad(Integer id) {
        List<Amistad> amistades = amistadRepositorio.findAmistadByUsuario_IdAndAmigo_Id(id, id);
        amistadRepositorio.deleteAll(amistades);
    }
}
