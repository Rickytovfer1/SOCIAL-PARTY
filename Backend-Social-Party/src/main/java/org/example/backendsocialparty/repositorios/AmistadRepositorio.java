package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Amistad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmistadRepositorio extends JpaRepository<Amistad, Integer> {

}
