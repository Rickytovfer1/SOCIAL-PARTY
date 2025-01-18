package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.RegistrarClienteDTO;
import org.example.backendsocialparty.DTOs.RegistrarEmpresaDTO;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.security.JWTService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;

@Service
@AllArgsConstructor
public class UsuarioServicio {

    private UsuarioRepositorio usuarioRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private EmpresaRepositorio empresaRepositorio;
    private final PasswordEncoder passwordEncoder;
    private JWTService jwtService;

    public Usuario registrarCliente(RegistrarClienteDTO dto){

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setCorreo(dto.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        nuevoUsuario.setRol(Rol.CLIENTE);

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setApellidos(dto.getApellidos());
        cliente.setDni(dto.getDni());
        cliente.setValoracion(dto.getValoracion());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fechaNacimiento = LocalDate.parse(dto.getFechaNacimiento(), formatter);
        cliente.setFechaNacimiento(fechaNacimiento);

        cliente.setTelefono(dto.getTelefono());
        cliente.setAmistades(new HashSet<>());
        cliente.setEntrada(new HashSet<>());
        cliente.setGrupos(new HashSet<>());

        Usuario usuarioGuardado = usuarioRepositorio.save(nuevoUsuario);
        cliente.setUsuario(usuarioGuardado);

        Cliente clienteGuardado = clienteRepositorio.save(cliente);

        return usuarioGuardado;

    }

    public Usuario registrarEmpresa(RegistrarEmpresaDTO dto){

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setCorreo(dto.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        nuevoUsuario.setRol(Rol.EMPRESA);

        Empresa empresa = new Empresa();
        empresa.setNombre(dto.getNombre());
        empresa.setDireccion(dto.getDireccion());
        empresa.setCodigoPostal(dto.getCodigoPostal());
        empresa.setNif(dto.getNif());
        empresa.setTelefono(dto.getTelefono());
        empresa.setValoracionMinima(dto.getValoracionMinima());
        empresa.setEdadMinima(dto.getEdadMinima());
        empresa.setEventos(new HashSet<>());

        Usuario usuarioGuardado = usuarioRepositorio.save(nuevoUsuario);
        empresa.setUsuario(usuarioGuardado);

        Empresa empresaGuardada = empresaRepositorio.save(empresa);

        return usuarioGuardado;

    }

}
