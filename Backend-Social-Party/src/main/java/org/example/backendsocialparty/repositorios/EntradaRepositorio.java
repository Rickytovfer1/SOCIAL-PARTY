package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface EntradaRepositorio extends JpaRepository<Entrada, Integer> {
    List<Entrada> findByCliente_Id(Integer id);
    Entrada findByCodigoEntrada(Integer codigoEntrada);
    @Query("SELECT e FROM Entrada e JOIN e.evento ev " +
            "WHERE e.cliente.id = :idCliente " +
            "AND (ev.fecha > :today OR (ev.fecha = :today AND ev.horaFinalizacion > :now))")
    List<Entrada> findEntradasActivas(@Param("idCliente") Integer idCliente,
                                      @Param("today") LocalDate today,
                                      @Param("now") LocalTime now);

    List<Entrada> findByEvento_Id(Integer id);
}
