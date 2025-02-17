package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findUsuarioByCorreo(String correo);

    Optional<Usuario> findTopByCorreo(String correo);

    boolean existsByCorreo(String correo);


}
