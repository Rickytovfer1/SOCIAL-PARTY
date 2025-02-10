package org.example.backendsocialparty.servicios;

import jakarta.transaction.Transactional;
import org.example.backendsocialparty.DTOs.AmistadDTO;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Amistad;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.repositorios.AmistadRepositorio;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.SolicitudRepositorio;
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
    private final SolicitudRepositorio solicitudRepositorio;
    public AmistadServicio(AmistadRepositorio amistadRepositorio, ClienteRepositorio clienteRepositorio, SolicitudRepositorio solicitudRepositorio) {
        this.amistadRepositorio = amistadRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.solicitudRepositorio = solicitudRepositorio;
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

    @Transactional
    public AmistadDTO aceptarSolicitud(Integer idUsuario, Integer idUsuario2) {
        Cliente usuario = clienteRepositorio.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new RuntimeException("No existe cliente para el Usuario ID " + idUsuario));
        Cliente amigo = clienteRepositorio.findByUsuarioId(idUsuario2)
                .orElseThrow(() -> new RuntimeException("No existe cliente para el Usuario ID " + idUsuario2));

        if (amistadRepositorio.existsByUsuario_IdAndAmigo_Id(usuario.getId(), amigo.getId()) ||
                amistadRepositorio.existsByUsuario_IdAndAmigo_Id(amigo.getId(), usuario.getId())) {
            throw new RuntimeException("Ya son amigos");
        }

        Amistad amistad = new Amistad();
        amistad.setUsuario(usuario);
        amistad.setAmigo(amigo);
        Amistad amistadGuardada = amistadRepositorio.save(amistad);
        solicitudRepositorio.deleteByUsuario1_IdAndUsuario2_Id(usuario.getId(), amigo.getId());
        AmistadDTO dto = new AmistadDTO();
        dto.setId(amistadGuardada.getId());
        dto.setIdUsuario(amistadGuardada.getUsuario().getUsuario().getId());
        dto.setIdAmigo(amistadGuardada.getAmigo().getUsuario().getId());
        return dto;
    }




    public void eliminarAmistad(Integer id) {
        List<Amistad> amistades = amistadRepositorio.findAmistadByUsuario_IdAndAmigo_Id(id, id);
        amistadRepositorio.deleteAll(amistades);
    }
}
