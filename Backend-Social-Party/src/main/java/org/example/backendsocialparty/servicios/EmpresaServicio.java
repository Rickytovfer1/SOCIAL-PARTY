package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.ClienteDTO;
import org.example.backendsocialparty.DTOs.EmpresaDTO;
import org.example.backendsocialparty.DTOs.RestarPuntoDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class EmpresaServicio {

    private EmpresaRepositorio empresaRepositorio;

    private ClienteRepositorio clienteRepositorio;

    public List<EmpresaDTO> listarEmpresas() {
        List<Empresa> empresas = empresaRepositorio.findAll();
        List<EmpresaDTO> empresasDTO = new ArrayList<>();
        for (Empresa empresa : empresas) {
            empresasDTO.add(getEmpresaDTO(empresa));
        }
        return empresasDTO;
    }

    public void restarPuntosCliente(RestarPuntoDTO dto) {

        Cliente cliente = clienteRepositorio.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("No existe un liente con este ID."));

        cliente.setValoracion(cliente.getValoracion() - dto.getPuntos());

        clienteRepositorio.save(cliente);
    }

    private static EmpresaDTO getEmpresaDTO(Empresa e) {
        EmpresaDTO dtonuevo = new EmpresaDTO();

        dtonuevo.setId(e.getId());
        dtonuevo.setNombre(e.getNombre());
        dtonuevo.setDireccion(e.getDireccion());
        dtonuevo.setCp(e.getCodigoPostal());
        dtonuevo.setNif(e.getNif());
        dtonuevo.setTelefono(e.getTelefono());
        dtonuevo.setValoracionMinima(e.getValoracionMinima());

        if (e.getEventos() != null) {
            Set<Integer> eventosDTO = new HashSet<>();
            for (Evento ev : e.getEventos()) {
                eventosDTO.add(ev.getId());
            }
            dtonuevo.setEventos(eventosDTO);
        }

        if (e.getUsuario() != null) {
            dtonuevo.setIdUsuario(e.getUsuario().getId());
        }

        return dtonuevo;
    }
}
