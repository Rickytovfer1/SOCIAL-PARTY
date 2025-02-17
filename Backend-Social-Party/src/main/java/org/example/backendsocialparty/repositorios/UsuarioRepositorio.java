package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findUsuarioByCorreo(String correo);

    Optional<Usuario> findTopByCorreo(String correo);

    @Query("SELECT u FROM Usuario u WHERE lower(u.correo) = lower(:correo) AND u.id <> :id")
    Optional<Usuario> findOtherByCorreoIgnoreCase(@Param("correo") String correo, @Param("id") Integer id);

}
