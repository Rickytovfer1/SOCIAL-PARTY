package org.example.backendsocialparty.controladores;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.EntradaDTO;
import org.example.backendsocialparty.servicios.EntradaServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class EntradaControlador {

    private EntradaServicio entradaServicio;

    @PostMapping("/empresa/canjear/entrada/{codigoEntrada}")
    public void canjearEntrada(@PathVariable Integer codigoEntrada) throws Exception {
        entradaServicio.canjearEntrada(codigoEntrada);
    }

    @PostMapping("/cliente/comprar/entrada/{idEvento}/{idEmpresa}/{idUsuario}")
    public EntradaDTO comprarEntrada(
            @PathVariable Integer idEvento,
            @PathVariable Integer idEmpresa,
            @PathVariable Integer idUsuario
    ) {
        return entradaServicio.comprarEntrada(idEvento, idEmpresa, idUsuario);
    }

    @GetMapping("/cliente/ver/entradas/{idCliente}")
    public List<EntradaDTO> verEntrada(@PathVariable Integer idCliente) {
        return entradaServicio.listarEntradas(idCliente);
    }

}
