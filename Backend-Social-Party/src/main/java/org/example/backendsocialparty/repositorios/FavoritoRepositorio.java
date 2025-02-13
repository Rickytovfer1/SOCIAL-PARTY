package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Favorito;
import org.example.backendsocialparty.modelos.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritoRepositorio extends JpaRepository<Favorito, Integer> {

    List<Favorito> findByPublicacion(Publicacion publicacion);
    List<Favorito> findByCliente(Cliente cliente);
    Favorito findByClienteAndPublicacion(Cliente cliente, Publicacion publicacion);
    List<Favorito> findByCliente_Id(Integer idCliente);

}
