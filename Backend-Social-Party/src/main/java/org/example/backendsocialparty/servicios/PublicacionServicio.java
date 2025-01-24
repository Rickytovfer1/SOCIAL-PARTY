package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClientePublicacionDTO;
import org.example.backendsocialparty.DTOs.MostrarPublicacionDTO;
import org.example.backendsocialparty.DTOs.PublicacionDTO;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.*;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class PublicacionServicio {

    private PublicacionRepositorio publicacionRepositorio;

    private UsuarioRepositorio usuarioRepositorio;

    private ClienteRepositorio clienteRepositorio;

    private EmpresaRepositorio empresaRepositorio;

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

    public void eliminarPublicacion(Integer id){
        List<Publicacion> publicaciones = publicacionRepositorio.findPublicacionesByUsuario_Id(id);

        for (Publicacion publicacion: publicaciones){

            if (publicacion.getUsuario().getRol() == Rol.CLIENTE){

                Cliente cliente = clienteRepositorio.findByUsuario_Id(publicacion.getUsuario().getId());

                if (Objects.equals(cliente.getUsuario().getId(), publicacion.getUsuario().getId())){
                    publicacionRepositorio.deleteAll(publicaciones);

                }
            }
            if (publicacion.getUsuario().getRol() == Rol.EMPRESA){

                Empresa empresa = empresaRepositorio.findByUsuario_Id(publicacion.getUsuario().getId());
                if (Objects.equals(empresa.getUsuario().getId(), publicacion.getUsuario().getId())){
                    publicacionRepositorio.deleteAll(publicaciones);
                }
            }

        }
    }


}
