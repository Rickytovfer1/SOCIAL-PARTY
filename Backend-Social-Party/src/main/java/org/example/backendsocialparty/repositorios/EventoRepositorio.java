package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepositorio extends JpaRepository<Evento, Integer> {

}
