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

    @PostMapping("/empresa/canjear/entrada/{idEntrada}")
    public void canjearEntrada(@PathVariable Integer idEntrada) throws Exception {
        entradaServicio.canjearEntrada(idEntrada);
    }

    @PostMapping("/cliente/comprar/entrada/{idEvento}/{idEmpresa}/{idCliente}")
    public void comprarEntrada(@PathVariable Integer idEvento, @PathVariable Integer idEmpresa,
                               @PathVariable Integer idCliente) {
        entradaServicio.comprarEntrada(idEvento, idEmpresa, idCliente);
    }

    @GetMapping("/cliente/ver/entradas/{idCliente}")
    public List<EntradaDTO> comprarEntrada(@PathVariable Integer idCliente) {
        return entradaServicio.listarEntradas(idCliente);
    }

}
