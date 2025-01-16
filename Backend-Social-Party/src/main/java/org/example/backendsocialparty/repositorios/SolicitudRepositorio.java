package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudRepositorio extends JpaRepository<Solicitud, Integer> {

}
