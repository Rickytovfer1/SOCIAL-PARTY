package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepositorio extends JpaRepository<Mensaje, Integer> {
    List<Mensaje> findByReceptor_IdOrEmisor_Id(Integer receptor_id, Integer emisor_id);
}
