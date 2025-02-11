package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.ComentarioDTO;
import org.example.backendsocialparty.DTOs.ComentarioEnvioDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Comentario;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.ComentarioRepositorio;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ComentarioService {

    private final ComentarioRepositorio comentarioRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final PublicacionRepositorio publicacionRepositorio;

    public ComentarioService(ComentarioRepositorio comentarioRepositorio, ClienteRepositorio clienteRepositorio, PublicacionRepositorio publicacionRepositorio) {
        this.comentarioRepositorio = comentarioRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.publicacionRepositorio = publicacionRepositorio;
    }

    public void comentar(ComentarioEnvioDTO comentarioDTO) {
        Comentario comentario = new Comentario();
        Cliente cliente = clienteRepositorio.findById(comentarioDTO.getId_cliente())
                .orElseThrow(() -> new RuntimeException("ID de cliente inexistente " + comentarioDTO.getId_cliente()));

        Publicacion publicacion = publicacionRepositorio.findById(comentarioDTO.getId_publicacion())
                .orElseThrow(() -> new RuntimeException("ID de publicación inexistente"));

        comentario.setCliente(cliente);
        comentario.setTexto(comentarioDTO.getTexto());
        comentario.setPublicacion(publicacion);
        comentario.setFecha(LocalDateTime.now());
        comentarioRepositorio.save(comentario);
    }

    public static ComentarioDTO getComentarioDTO(Comentario comentario) {

        ComentarioDTO dtonuevo = new ComentarioDTO();
        dtonuevo.setTexto(comentario.getTexto());
        dtonuevo.setIdPublicacion(comentario.getPublicacion().getId());
        dtonuevo.setIdCliente(comentario.getCliente().getId());
        dtonuevo.setFecha(comentario.getFecha());
        return dtonuevo;
    }


}
