package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpresaRepositorio extends JpaRepository<Empresa, Integer> {

    Empresa findByNif(String nif);

    Empresa findByUsuario_Id(Integer id);
    Optional<Empresa> findByUsuarioCorreo(String correo);
    Optional<Empresa> findByUsuarioId(Integer usuarioId);

    boolean existsByNif(String nif);
    boolean existsByTelefono(String telefono);

    Optional<Empresa> findByTelefono(String telefono);
}
