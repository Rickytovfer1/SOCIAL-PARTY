package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.servicios.EntradaServicio;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping()
@AllArgsConstructor
public class EntradaControlador {

    private EntradaServicio entradaServicio;

    @PostMapping("/empresa/canjear/entrada/{idEntrada}")
    public void canjearEntrada(@PathVariable Integer idEntrada) throws Exception {
        entradaServicio.canjearEntrada(idEntrada);
    }

    @PostMapping("/cliente/comprar/entrada/{idEvento}/{idEmpresa}/{idCliente}")
    public void comprarEntrada(@PathVariable Integer idEvento, @PathVariable Integer idEmpresa,
                               @PathVariable Integer idCliente) {
        entradaServicio.comprarEntrada(idEvento, idEmpresa, idCliente);
    }

}
