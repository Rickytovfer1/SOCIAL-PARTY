package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface EventoRepositorio extends JpaRepository<Evento, Integer> {
    List<Evento> findByEmpresa_Id(Integer id);
}
