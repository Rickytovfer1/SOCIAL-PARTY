package org.example.backendsocialparty.servicios;

import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.modelos.VerificationToken;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.repositorios.VerificationTokenRepository;
import org.example.backendsocialparty.security.JWTService;
import org.example.backendsocialparty.security.UsuarioAdapter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UsuarioServicio implements UserDetailsService {

    private UsuarioRepositorio usuarioRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private EmpresaRepositorio empresaRepositorio;
    private VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private JWTService jwtService;
    private EmailService emailService;

    public Usuario registrarCliente(RegistrarClienteDTO dto){

        List<Usuario> usuarios = usuarioRepositorio.findAll();

        Usuario nuevoUsuario = new Usuario();
        Cliente cliente = new Cliente();

        for (Usuario usuario : usuarios) {
            if (usuario.getCorreo().equals(dto.getCorreo())){
                nuevoUsuario = usuario;
                cliente = clienteRepositorio.findClienteByDni(dto.getDni());
            } else {
                nuevoUsuario = new Usuario();
                cliente = new Cliente();
            }
        }

        nuevoUsuario.setCorreo(dto.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        nuevoUsuario.setRol(Rol.CLIENTE);

        cliente.setNombre(dto.getNombre());
        cliente.setApellidos(dto.getApellidos());
        cliente.setDni(dto.getDni());
        cliente.setValoracion(100);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fechaNacimiento = LocalDate.parse(dto.getFechaNacimiento(), formatter);
        cliente.setFechaNacimiento(fechaNacimiento);

        cliente.setTelefono(dto.getTelefono());
        cliente.setAmistades(new HashSet<>());
        cliente.setEntradas(new HashSet<>());
        cliente.setGrupos(new HashSet<>());

        Usuario usuarioGuardado = usuarioRepositorio.save(nuevoUsuario);
        cliente.setUsuario(usuarioGuardado);

        clienteRepositorio.save(cliente);
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        VerificationToken verificationToken = new VerificationToken(token, usuarioGuardado, expiryDate);
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(usuarioGuardado.getCorreo(), token);
        return usuarioGuardado;

    }
    public Integer obtenerIdClientePorUsuario(Integer idUsuario) {
        Cliente cliente = clienteRepositorio.findByUsuario_Id(idUsuario);
        if (cliente == null) {
            throw new RuntimeException("No existe un cliente asociado a este usuario.");
        }
        return cliente.getId();
    }

    public Usuario registrarEmpresa(RegistrarEmpresaDTO dto){

        List<Usuario> usuarios = usuarioRepositorio.findAll();

        Usuario nuevoUsuario = new Usuario();
        Empresa empresa = new Empresa();

        for (Usuario usuario : usuarios) {
            if (usuario.getCorreo().equals(dto.getCorreo())){
                nuevoUsuario = usuario;
                empresa = empresaRepositorio.findByNif(dto.getNif());
            } else {
                nuevoUsuario = new Usuario();
                empresa = new Empresa();
            }
        }

        nuevoUsuario.setCorreo(dto.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        nuevoUsuario.setRol(Rol.EMPRESA);

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
        empresaRepositorio.save(empresa);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        VerificationToken verificationToken = new VerificationToken(token, usuarioGuardado, expiryDate);
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(usuarioGuardado.getCorreo(), token);
        return usuarioGuardado;


    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepositorio.findTopByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new UsuarioAdapter(usuario);
    }


    public ResponseEntity<RespuestaDTO> login(LoginDTO dto) {
        UserDetails userDetails = loadUserByUsername(dto.getCorreo());
        if (userDetails == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        if (!userDetails.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RespuestaDTO.builder()
                            .estado(HttpStatus.UNAUTHORIZED.value())
                            .mensaje("Cuenta no verificada. Por favor, verifica tu correo electrónico.")
                            .build());
        }

        if (passwordEncoder.matches(dto.getContrasena(), userDetails.getPassword())) {
            Usuario usuario = ((UsuarioAdapter) userDetails).getUsuario();
            String token = jwtService.generateToken(usuario);
            return ResponseEntity.ok(RespuestaDTO.builder()
                    .estado(HttpStatus.OK.value())
                    .token(token)
                    .build());
        } else {
            throw new BadCredentialsException("Contraseña incorrecta");
        }
    }



    public UsuarioDTO buscarUsuarioPorCliente(Integer idCliente){
        Cliente cliente = clienteRepositorio.findById(idCliente).orElseThrow(()-> new RuntimeException("No existe un cliente con este ID."));
        Usuario usuario = usuarioRepositorio.findById(cliente.getUsuario().getId()).orElse(null);

        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setCorreo(usuario.getCorreo());

        return usuarioDTO;
    }

    public UsuarioDTO buscarUsuarioPorEmpresa(Integer idEmpresa){
        Empresa empresa = empresaRepositorio.findById(idEmpresa).orElseThrow(()-> new RuntimeException("No existe un cliente con este ID."));
        Usuario usuario = usuarioRepositorio.findById(empresa.getUsuario().getId()).orElse(null);

        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setCorreo(usuario.getCorreo());

        return usuarioDTO;
    }

}
