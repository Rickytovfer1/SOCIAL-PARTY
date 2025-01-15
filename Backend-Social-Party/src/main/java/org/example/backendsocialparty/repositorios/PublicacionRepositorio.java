package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicacionRepositorio extends JpaRepository<Publicacion, Integer> {

}
