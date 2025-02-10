package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Amistad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface AmistadRepositorio extends JpaRepository<Amistad, Integer> {
    List<Amistad> findAmistadByUsuario_IdAndAmigo_Id(Integer usuarioId, Integer amigoId);
    @Query("SELECT a FROM Amistad a WHERE a.usuario.id = :userId OR a.amigo.id = :userId")
    List<Amistad> findAllByUserId(@Param("userId") Integer userId);
    List<Amistad> findAllByUsuario_IdOrAmigo_Id(Integer usuarioId, Integer amigoId);
    boolean existsByUsuario_IdAndAmigo_Id(Integer id, Integer id1);
}
