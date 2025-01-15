package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntradaRepositorio extends JpaRepository<Entrada, Integer> {

}
