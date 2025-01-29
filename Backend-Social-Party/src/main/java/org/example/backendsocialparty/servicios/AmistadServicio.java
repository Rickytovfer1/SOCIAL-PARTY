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

        if (!clienteRepositorio.existsByUsuarioId(idUsuario)) {
            throw new RuntimeException("No existe un cliente asociado a este Usuario ID.");
        }

        Cliente cliente = clienteRepositorio.findByUsuarioId(idUsuario);

        List<Amistad> amistades = amistadRepositorio.findAllByUsuario_IdOrAmigo_Id(cliente.getId(), cliente.getId());
        List<ClienteDTO> clientesDTOs = new ArrayList<>();

        for (Amistad a : amistades) {
            Cliente amigo;
            if (a.getUsuario().getId().equals(cliente.getId())) {
                amigo = a.getAmigo();
            } else {
                amigo = a.getUsuario();
            }
            ClienteDTO dto = clienteServicio.getClienteDTO(amigo);
            if (!clientesDTOs.contains(dto)) {
                clientesDTOs.add(dto);
            }
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

    public void eliminarAmistad(Integer id) {
        List<Amistad> amistades = amistadRepositorio.findAmistadByUsuario_IdAndAmigo_Id(id, id);
        amistadRepositorio.deleteAll(amistades);
    }

}
