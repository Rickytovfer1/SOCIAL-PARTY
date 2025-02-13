package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepositorio extends JpaRepository<Solicitud, Integer> {
    List<Solicitud> findByUsuario1_IdOrUsuario2_Id(Integer idUsuario1, Integer idUsuario2);
    List<Solicitud> findByUsuario2_Id(Integer idUsuario2);
    boolean existsByUsuario1_IdAndUsuario2_Id(Integer id, Integer id1);
    void deleteByUsuario1_IdAndUsuario2_Id(Integer idUsuario1, Integer idUsuario2);
}
