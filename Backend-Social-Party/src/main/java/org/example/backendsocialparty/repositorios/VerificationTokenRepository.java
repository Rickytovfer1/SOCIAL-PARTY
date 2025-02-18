package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    VerificationToken findByUsuario_Id(Integer idUsuario);

}

