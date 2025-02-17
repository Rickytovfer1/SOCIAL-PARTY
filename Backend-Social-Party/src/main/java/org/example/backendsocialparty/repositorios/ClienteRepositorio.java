package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, Integer> {

    Cliente findClienteByDni(String dni);
    Cliente findByUsuario_Id(Integer id);
    boolean existsByUsuarioId(Integer usuarioId);
    Optional<Cliente> findByUsuarioId(Integer usuarioId);
    List<Cliente> findClientesByEventosContains(Evento evento);

    boolean existsByDni(String dni);
    boolean existsByTelefono(String telefono);

}

