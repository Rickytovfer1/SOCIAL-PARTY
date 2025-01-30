package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PublicacionRepositorio extends JpaRepository<Publicacion, Integer> {
    List<Publicacion> findByUsuario_Id(Integer idUsuario);
    List<Publicacion> findPublicacionesByUsuario_Id(Integer idUsuario);
}
