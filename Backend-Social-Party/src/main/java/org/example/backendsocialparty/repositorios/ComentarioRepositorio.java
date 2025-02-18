package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Comentario;
import org.example.backendsocialparty.modelos.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepositorio extends JpaRepository<Comentario, Integer> {

    List<Comentario> findByCliente(Cliente cliente);
    List<Comentario> findByPublicacion(Publicacion publicacion);
    List<Comentario> findByCliente_Id(Integer idCliente);
    List<Comentario> findByPublicacion_Id(Integer idPublicacion);

}
