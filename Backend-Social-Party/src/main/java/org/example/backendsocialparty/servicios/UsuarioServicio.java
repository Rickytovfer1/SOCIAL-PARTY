package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.LoginDTO;
import org.example.backendsocialparty.DTOs.RegistrarClienteDTO;
import org.example.backendsocialparty.DTOs.RegistrarEmpresaDTO;
import org.example.backendsocialparty.DTOs.RespuestaDTO;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.security.JWTService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UsuarioServicio implements UserDetailsService {

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
        cliente.setEntradas(new HashSet<>());
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

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        return usuarioRepositorio.findTopByCorreo(correo).orElse(null);
    }

    public ResponseEntity<RespuestaDTO> login(LoginDTO dto){

        // Buscar usuario por nombre de usuario
        Optional<Usuario> usuarioOpcional = usuarioRepositorio.findUsuarioByCorreo(dto.getCorreo());

        if (usuarioOpcional.isPresent()) {
            Usuario usuario = usuarioOpcional.get();

            // Verificar la contraseña
            if (passwordEncoder.matches(dto.getContrasena(), usuario.getPassword())) {

                // Contraseña válida, devolver token de acceso
                String token = jwtService.generateToken(usuario);
                return ResponseEntity
                        .ok(RespuestaDTO
                                .builder()
                                .estado(HttpStatus.OK.value())
                                .token(token).build());
            } else {
                throw new BadCredentialsException("Contraseña incorrecta");
            }
        } else {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

    }

}
