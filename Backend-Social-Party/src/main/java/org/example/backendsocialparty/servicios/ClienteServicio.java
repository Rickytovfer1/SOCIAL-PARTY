package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.modelos.Amistad;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Entrada;
import org.example.backendsocialparty.modelos.Grupo;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class ClienteServicio {

    public static ClienteDTO getClienteDTO(Cliente c) {
        ClienteDTO dtonuevo = new ClienteDTO();

        dtonuevo.setId(c.getId());
        dtonuevo.setNombre(c.getNombre());
        dtonuevo.setApellidos(c.getApellidos());
        dtonuevo.setDni(c.getDni());
        dtonuevo.setTelefono(c.getTelefono());
        dtonuevo.setFechaNacimiento(c.getFechaNacimiento());
        dtonuevo.setValoracion(c.getValoracion());

        if (c.getAmistades() != null) {
            Set<Integer> amigosDTO = new HashSet<>();
            for (Amistad a : c.getAmistades()) {
                amigosDTO.add(a.getId());
            }
            dtonuevo.setAmigos(amigosDTO);
        }

        if (c.getEntradas() != null) {
            Set<Integer> entradasDTO = new HashSet<>();
            for (Entrada e : c.getEntradas()) {
                entradasDTO.add(e.getId());
            }
            dtonuevo.setEntradas(entradasDTO);
        }

        if (c.getGrupos() != null) {
            Set<Integer> gruposDTO = new HashSet<>();
            for (Grupo g : c.getGrupos()) {
                gruposDTO.add(g.getId());
            }
            dtonuevo.setAmigos(gruposDTO);
        }

        if (c.getUsuario() != null) {
            dtonuevo.setIdUsuario(c.getUsuario().getId());
        }

        return dtonuevo;
    }
}
