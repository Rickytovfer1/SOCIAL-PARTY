package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.modelos.*;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.ComentarioRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.servicios.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.*;
import java.time.LocalDate;
import java.nio.file.*;
import java.io.*;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;


@Service
public class ClienteServicio {
    private final EmpresaServicio empresaServicio;
    private final UsuarioServicio usuarioServicio;
    private final ClienteRepositorio clienteRepositorio;
    private final PublicacionServicio publicacionServicio;
    private final MensajeServicio mensajeServicio;
    private final SolicitudServicio solicitudServicio;
    private final AmistadServicio amistadServicio;
    private final EntradaServicio entradaServicio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final ComentarioRepositorio comentarioRepositorio;
    private final EventoServicio eventoServicio;
    private final ComentarioService comentarioService;
    private final EmpresaRepositorio empresaRepositorio;
    private final FavoritoServicio favoritoServicio;
    @Value("${upload.dir}")
    private String uploadDir;


    public ClienteServicio(
            ClienteRepositorio clienteRepositorio,
            PublicacionServicio publicacionServicio,
            MensajeServicio mensajeServicio,
            SolicitudServicio solicitudServicio,
            @Lazy AmistadServicio amistadServicio,
            @Lazy EventoServicio eventoServicio,
            EntradaServicio entradaServicio,
            UsuarioRepositorio usuarioRepositorio,
            ComentarioRepositorio comentarioRepositorio, ComentarioService comentarioService,
            EmpresaRepositorio empresaRepositorio,
            FavoritoServicio favoritoServicio, EmpresaServicio empresaServicio, UsuarioServicio usuarioServicio) {
        this.clienteRepositorio = clienteRepositorio;
        this.publicacionServicio = publicacionServicio;
        this.mensajeServicio = mensajeServicio;
        this.solicitudServicio = solicitudServicio;
        this.amistadServicio = amistadServicio;
        this.eventoServicio = eventoServicio;
        this.entradaServicio = entradaServicio;
        this.usuarioRepositorio = usuarioRepositorio;
        this.comentarioRepositorio = comentarioRepositorio;
        this.comentarioService = comentarioService;
        this.empresaRepositorio = empresaRepositorio;
        this.favoritoServicio = favoritoServicio;
        this.empresaServicio = empresaServicio;
        this.usuarioServicio = usuarioServicio;
    }


    public ClienteDTO buscarClienteId(Integer id) {
        Cliente cliente = clienteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        return getClienteDTO(cliente);
    }

    public ClienteDTO busccarClienteUsuarioID(Integer idUsuario) {
        Cliente cliente = clienteRepositorio.findByUsuario_Id(idUsuario);
        return getClienteDTO(cliente);
    }

    public List<ClienteDTO> listarClientes() {
        List<Cliente> clientes = clienteRepositorio.findAll();
        List<ClienteDTO> clienteDTOS = new ArrayList<>();
        for (Cliente cliente : clientes) {
            clienteDTOS.add(getClienteDTO(cliente));
        }
        return clienteDTOS;
    }

    public static ClienteDTO getClienteDTO(Cliente c) {
        ClienteDTO dtonuevo = new ClienteDTO();
        dtonuevo.setId(c.getId());
        dtonuevo.setNombre(c.getNombre());
        dtonuevo.setApellidos(c.getApellidos());
        dtonuevo.setDni(c.getDni());
        dtonuevo.setTelefono(c.getTelefono());
        dtonuevo.setFechaNacimiento(c.getFechaNacimiento());
        dtonuevo.setValoracion(c.getValoracion());
        dtonuevo.setBiografia(c.getBiografia());
        dtonuevo.setFotoPerfil(c.getFotoPerfil());

        if (c.getAmistades() != null) {
            Set<Integer> amigosDTO = new HashSet<>();
            for (Amistad a : c.getAmistades()) {
                amigosDTO.add(a.getId());
            }
            dtonuevo.setAmigos(amigosDTO);
        }

        if (c.getEntradas() != null) {
            Set<Integer> entradasDTO = new HashSet<>();
            for (Entrada e : c.getEntradas()) {
                entradasDTO.add(e.getId());
            }
            dtonuevo.setEntradas(entradasDTO);
        }

        if (c.getGrupos() != null) {
            Set<Integer> gruposDTO = new HashSet<>();
            for (Grupo g : c.getGrupos()) {
                gruposDTO.add(g.getId());
            }
            dtonuevo.setAmigos(gruposDTO);
        }

        if (c.getEventos() != null && !c.getEventos().isEmpty()) {
            Evento evento = c.getEventos().iterator().next();
            dtonuevo.setEvento(evento.getId());
        }


        if (c.getUsuario() != null) {
            dtonuevo.setIdUsuario(c.getUsuario().getId());

        }

        return dtonuevo;
    }

    public void eliminarCliente(Integer id) {

        Cliente cliente = clienteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        empresaServicio.eliminarBaneadoCliente(id);
        comentarioService.eliminarComentario(id);
        favoritoServicio.eliminarLike(id);
        entradaServicio.eliminarEntrada(id);
        eventoServicio.eliminarPersonaEvento(id);
        amistadServicio.eliminarAmistadCliente(id);
        solicitudServicio.eliminarSolicitudCli(id);
        publicacionServicio.eliminarPublicacionCliente(id);
        mensajeServicio.eliminarMensajes(id);
        usuarioServicio.eliminarUsuarioVerificacion(cliente.getUsuario().getId());
        clienteRepositorio.delete(cliente);
    }


    public ClienteDTO actualizarCliente(ClienteDTO clienteDTO) {
        clienteDTO.setCorreo(null);
        return actualizarClienteInterno(clienteDTO, null);
    }

    public ClienteDTO actualizarCliente(ClienteDTO clienteDTO, UsuarioDTO usuarioDTO) {
        if (usuarioDTO != null && usuarioDTO.getCorreo() != null) {
            clienteDTO.setCorreo(usuarioDTO.getCorreo());
        }
        return actualizarClienteInterno(clienteDTO, usuarioDTO);
    }

    private ClienteDTO actualizarClienteInterno(ClienteDTO clienteDTO, UsuarioDTO usuarioDTO) {
        Cliente cliente = clienteRepositorio.findById(clienteDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe un cliente con este ID."));
        cliente.setNombre(clienteDTO.getNombre());
        cliente.setApellidos(clienteDTO.getApellidos());
        cliente.setDni(clienteDTO.getDni());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setFechaNacimiento(clienteDTO.getFechaNacimiento());
        cliente.setBiografia(clienteDTO.getBiografia());
        cliente.setFotoPerfil(clienteDTO.getFotoPerfil());

        if (usuarioDTO != null && clienteDTO.getCorreo() != null) {
            Usuario usuario = cliente.getUsuario();
            if (usuario != null) {
                String nuevoCorreo = clienteDTO.getCorreo().trim().toLowerCase();
                String correoActual = usuario.getCorreo() != null ? usuario.getCorreo().trim().toLowerCase() : "";
                if (!nuevoCorreo.equals(correoActual)) {
                    Optional<Usuario> usuarioExistente = usuarioRepositorio.findOtherByCorreoIgnoreCase(nuevoCorreo, usuario.getId());
                    if (usuarioExistente.isPresent()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo ya está en uso por otro usuario.");
                    }
                    usuario.setCorreo(nuevoCorreo);
                    usuarioRepositorio.save(usuario);
                }
            }
        }
        Cliente clienteActualizado = clienteRepositorio.save(cliente);
        return getClienteDTO(clienteActualizado);
    }






    public String guardarFoto(MultipartFile foto) {
        if (foto.isEmpty()) {
            return null;
        }
        String extension = getFileExtension(foto.getOriginalFilename());
        String filename = UUID.randomUUID().toString() + "." + extension;
        Path path = Paths.get(uploadDir, filename);
        try {
            Files.createDirectories(path.getParent());
            Files.copy(foto.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int lastIndex = filename.lastIndexOf(".");
        return (lastIndex == -1) ? "" : filename.substring(lastIndex + 1);
    }

    public List<ComentarioDTO> listarComentarios(int idCliente) {
        Cliente cliente = clienteRepositorio.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("ID de cliente inexistente"));

        List<Comentario> listaComentarios = comentarioRepositorio.findByCliente(cliente);
        List<ComentarioDTO> listaComentariosDTO = new ArrayList<>();
        for (Comentario comentario : listaComentarios) {
            listaComentariosDTO.add(ComentarioService.getComentarioDTO(comentario));
        }
        return listaComentariosDTO;
    }

    public void modificarEstrella(EditarEstrellaDTO dto) {
        Cliente cliente = clienteRepositorio.findById(dto.getIdCliente()).orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        cliente.setValoracion(dto.getValoracion());
        clienteRepositorio.save(cliente);


    }

    public void banearCliente(Integer id) {
        Cliente cliente = clienteRepositorio.findById(id).orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        List<Empresa> empresas = empresaRepositorio.findAll();
        Set<Cliente> baneados = new HashSet<>();
        baneados.add(cliente);

        for (Empresa empresa : empresas) {
            empresa.setBaneados(baneados);
            empresaRepositorio.save(empresa);
        }

    }

    public void eliminarBaneado(Integer id) {
        Cliente cliente = clienteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        List<Empresa> empresas = empresaRepositorio.findAll();

        for (Empresa empresa : empresas) {
            Set<Cliente> baneados = empresa.getBaneados();
            if (baneados != null) {
                baneados.remove(cliente);
                empresa.setBaneados(baneados);
                empresaRepositorio.save(empresa);
            }
        }
    }

}