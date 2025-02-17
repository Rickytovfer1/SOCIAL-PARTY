package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.ComentarioDTO;
import org.example.backendsocialparty.DTOs.ComentarioEnvioDTO;
import org.example.backendsocialparty.DTOs.NotificacionDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Comentario;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.ComentarioRepositorio;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComentarioService {

    private final ComentarioRepositorio comentarioRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final PublicacionRepositorio publicacionRepositorio;
    private final NotificacionService notificacionService;

    public ComentarioService(ComentarioRepositorio comentarioRepositorio, ClienteRepositorio clienteRepositorio, PublicacionRepositorio publicacionRepositorio, NotificacionService notificacionService) {
        this.comentarioRepositorio = comentarioRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.publicacionRepositorio = publicacionRepositorio;
        this.notificacionService = notificacionService;
    }

    public void comentar(ComentarioEnvioDTO comentarioDTO) {
        Comentario comentario = new Comentario();
        Cliente cliente = clienteRepositorio.findById(comentarioDTO.getId_cliente()).orElseThrow(() -> new RuntimeException("ID de cliente inexistente " + comentarioDTO.getId_cliente()));
        Publicacion publicacion = publicacionRepositorio.findById(comentarioDTO.getId_publicacion()).orElseThrow(() -> new RuntimeException("ID de publicación inexistente"));
        comentario.setCliente(cliente);
        comentario.setTexto(comentarioDTO.getTexto());
        comentario.setNombre(cliente.getNombre());
        comentario.setPublicacion(publicacion);
        comentario.setFecha(LocalDateTime.now());
        comentarioRepositorio.save(comentario);
        if (publicacion.getUsuario() != null && !publicacion.getUsuario().getId().equals(cliente.getUsuario().getId())) {
            NotificacionDTO notificacionDTO = new NotificacionDTO();
            notificacionDTO.setIdUsuario(publicacion.getUsuario().getId());
            notificacionDTO.setTipo("comentario");
            notificacionDTO.setMensaje("Tu publicación recibió un nuevo comentario de " + cliente.getNombre());
            notificacionDTO.setIdReferencia(Long.valueOf(publicacion.getId()));
            notificacionService.enviarNotificacion(notificacionDTO);
        }
    }

    public static ComentarioDTO getComentarioDTO(Comentario comentario) {
        Cliente cliente = comentario.getCliente();
        ComentarioDTO dtonuevo = new ComentarioDTO();
        dtonuevo.setTexto(comentario.getTexto());
        dtonuevo.setNombre(cliente.getNombre());
        dtonuevo.setId_publicacion(comentario.getPublicacion().getId());
        dtonuevo.setId_cliente(comentario.getCliente().getId());
        dtonuevo.setFecha(comentario.getFecha());
        return dtonuevo;
    }

    public void eliminarComentario(Integer id) {
        List<Comentario> comentarios = comentarioRepositorio.findByCliente_Id(id);
        comentarioRepositorio.deleteAll(comentarios);
    }
}
