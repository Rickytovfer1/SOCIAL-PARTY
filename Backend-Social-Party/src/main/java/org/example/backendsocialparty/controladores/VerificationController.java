package org.example.backendsocialparty.controladores;

import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.modelos.VerificationToken;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.repositorios.VerificationTokenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
public class VerificationController {

    private final VerificationTokenRepository tokenRepository;
    private final UsuarioRepositorio usuarioRepositorio;

    public VerificationController(VerificationTokenRepository tokenRepository, UsuarioRepositorio usuarioRepositorio) {
        this.tokenRepository = tokenRepository;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        Optional<VerificationToken> optionalToken = tokenRepository.findByToken(token);
        if (!optionalToken.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido");
        }

        VerificationToken verificationToken = optionalToken.get();

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El token ha expirado");
        }

        Usuario usuario = verificationToken.getUsuario();
        usuario.setEnabled(true);
        usuarioRepositorio.save(usuario);

        tokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Cuenta verificada exitosamente");
    }
}

