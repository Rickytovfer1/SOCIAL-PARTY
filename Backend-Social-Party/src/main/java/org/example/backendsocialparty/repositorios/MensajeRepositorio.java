package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensajeRepositorio extends JpaRepository<Mensaje, Integer> {

}
