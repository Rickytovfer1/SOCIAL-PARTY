package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
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
@AllArgsConstructor
public class AmistadServicio {

    private AmistadRepositorio amistadRepositorio;

    private ClienteRepositorio clienteRepositorio;

    public Set<Cliente> getAmistad(Integer idUsuario) throws Exception{

        if (idUsuario == null){
            throw new Exception("El idUsuario es nulo");
        }

        Set<Amistad> amistades = amistadRepositorio.findByUsuario2_Id(idUsuario);

        Set<Cliente> usuarios = new HashSet<>();

        for (Amistad amigo : amistades) {
            Cliente usuarioAmigo = amigo.getUsuario1();
            usuarios.add(usuarioAmigo);
        }

        return usuarios;

    }

    public Amistad aceptarSolicitud(Integer idUsuario, Integer idUsuario2){
        Cliente usuario = clienteRepositorio.getReferenceById(idUsuario);
        Cliente usuario2 = clienteRepositorio.getReferenceById(idUsuario2);

        Amistad amistad = new Amistad();
        amistad.setUsuario1(usuario);
        amistad.setUsuario2(usuario2);

        return amistadRepositorio.save(amistad);

    }


}
