package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClientePublicacionDTO;
import org.example.backendsocialparty.DTOs.MostrarPublicacionDTO;
import org.example.backendsocialparty.DTOs.PublicacionDTO;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class PublicacionServicio {

    private PublicacionRepositorio publicacionRepositorio;

    private UsuarioRepositorio usuarioRepositorio;

    public void guardarPublicacion(PublicacionDTO dto) {

        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setTexto(dto.getTexto());
        publicacion.setTitulo(dto.getTitulo());
        publicacion.setHora(LocalTime.now());
        publicacion.setFecha(LocalDate.now());
        publicacion.setFoto(dto.getFoto());
        publicacion.setDireccion(dto.getDireccion());

        Usuario usuario = usuarioRepositorio.findById(dto.getIdUsuario()).orElse(null);
        publicacion.setUsuario(usuario);

        publicacionRepositorio.save(publicacion);
    }

    public void guardarPublicacionCliente(ClientePublicacionDTO dto) {

        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setTexto(dto.getTexto());
        publicacion.setHora(LocalTime.now());
        publicacion.setFecha(LocalDate.now());
        publicacion.setFoto(dto.getFoto());

        Usuario usuario = usuarioRepositorio.findById(dto.getIdUsuario()).orElse(null);
        publicacion.setUsuario(usuario);

        publicacionRepositorio.save(publicacion);
    }

    public List<MostrarPublicacionDTO> mostrarPublicaciones() {

        List<Publicacion> publicaciones = publicacionRepositorio.findAll();
        List<MostrarPublicacionDTO> publicacionDTO = new ArrayList<>();

        for (Publicacion publicacion : publicaciones) {
            publicacionDTO.add(getEventoDTO(publicacion));
        }

        return publicacionDTO;

    }

    private static MostrarPublicacionDTO getEventoDTO(Publicacion p) {
        MostrarPublicacionDTO publicacionDTO = new MostrarPublicacionDTO();

        publicacionDTO.setId(p.getId());
        publicacionDTO.setTexto(p.getTexto());
        publicacionDTO.setHora(p.getHora());
        publicacionDTO.setFecha(p.getFecha());
        publicacionDTO.setFoto(p.getFoto());
        publicacionDTO.setTitulo(p.getTitulo());
        publicacionDTO.setDireccion(p.getFoto());
        publicacionDTO.setIdUsuario(p.getUsuario().getId());

        return publicacionDTO;
    }



}
