package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, Integer> {

    Cliente findClienteByDni(String dni);
    Cliente findByUsuario_Id(Integer id);
}
