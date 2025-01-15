package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepositorio extends JpaRepository<Empresa, Integer> {

}
