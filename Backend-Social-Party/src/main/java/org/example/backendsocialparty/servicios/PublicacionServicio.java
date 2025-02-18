package org.example.backendsocialparty.servicios;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.*;
import org.example.backendsocialparty.repositorios.*;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicacionServicio {

    private final PublicacionRepositorio publicacionRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final EmpresaRepositorio empresaRepositorio;
    private final @Lazy AmistadServicio amistadServicio;
    private final ComentarioRepositorio comentarioRepositorio;

    @Value("${upload.dir}")
    private String uploadDir;

    public void guardarPublicacion(PublicacionDTO dto, MultipartFile foto) {
        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setNombre(dto.getNombre());
        publicacion.setTexto(dto.getTexto());
        publicacion.setFecha(LocalDateTime.now());

        String fotoUrl = guardarImagen(foto);
        publicacion.setFoto(fotoUrl);
        publicacion.setLugar(dto.getLugar());

        Usuario usuario = usuarioRepositorio.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        publicacion.setUsuario(usuario);

        publicacionRepositorio.save(publicacion);
    }

    public void guardarPublicacionCliente(ClientePublicacionDTO dto, MultipartFile foto) {
        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setNombre(dto.getNombre());
        publicacion.setApellidos(dto.getApellidos());
        publicacion.setTexto(dto.getTexto());
        publicacion.setFecha(LocalDateTime.now());
        publicacion.setLugar(dto.getLugar());

        String fotoUrl = guardarImagen(foto);
        publicacion.setFoto(fotoUrl);

        Usuario usuario = usuarioRepositorio.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        publicacion.setUsuario(usuario);

        publicacionRepositorio.save(publicacion);
    }

    private String guardarImagen(MultipartFile foto) {
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

    public List<MostrarPublicacionDTO> mostrarPublicaciones() {
        List<Publicacion> publicaciones = publicacionRepositorio.findAll();
        List<MostrarPublicacionDTO> publicacionDTO = new ArrayList<>();
        for (Publicacion publicacion : publicaciones) {
            publicacionDTO.add(getPublicacionDTO(publicacion));
        }
        return publicacionDTO;
    }

    public static MostrarPublicacionDTO getPublicacionDTO(Publicacion p) {
        MostrarPublicacionDTO publicacionDTO = new MostrarPublicacionDTO();
        publicacionDTO.setId(p.getId());
        publicacionDTO.setNombre(p.getNombre());
        if (p.getApellidos() != null) {
            publicacionDTO.setApellidos(p.getApellidos());
        }
        publicacionDTO.setTexto(p.getTexto());
        publicacionDTO.setFecha(p.getFecha());
        publicacionDTO.setFoto(p.getFoto());
        publicacionDTO.setLugar(p.getLugar());
        publicacionDTO.setIdUsuario(p.getUsuario().getId());
        return publicacionDTO;
    }

    @Transactional
    public void eliminarPublicacionCliente(Integer id) {
        Cliente cliente = clienteRepositorio.findById(id).orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        List<Publicacion> publicaciones = publicacionRepositorio.findPublicacionesByUsuario_Id(cliente.getUsuario().getId());
        if (!publicaciones.isEmpty()) {
            for (Publicacion publicacion : publicaciones) {
                List<Comentario> comentarios = comentarioRepositorio.findByPublicacion_Id(publicacion.getId());
                if (!comentarios.isEmpty()) {
                    comentarioRepositorio.deleteAll(comentarios);
                }
            }
            publicacionRepositorio.deleteAll(publicaciones);
        }
    }

    public void eliminarPublicacionEmpresa(Integer id) {
        Empresa empresa = empresaRepositorio.findById(id).orElseThrow(() -> new RuntimeException("Empresa no encontrado"));

        List<Publicacion> publicaciones = publicacionRepositorio.findPublicacionesByUsuario_Id(empresa.getUsuario().getId());
        if (!publicaciones.isEmpty()) {
            for (Publicacion publicacion : publicaciones) {
                List<Comentario> comentarios = comentarioRepositorio.findByPublicacion_Id(publicacion.getId());
                if (!comentarios.isEmpty()) {
                    comentarioRepositorio.deleteAll(comentarios);
                }
            }
            publicacionRepositorio.deleteAll(publicaciones);
        }
    }


    public List<MostrarPublicacionDTO> mostrarPublicacionesPorEmpresa(Integer idEmpresa) {
        Empresa empresa = empresaRepositorio.findByUsuario_Id(idEmpresa);
        if (empresa == null) {
            throw new RuntimeException("Empresa no encontrada");
        }
        List<Publicacion> publicaciones = publicacionRepositorio.findByUsuario_Id(empresa.getUsuario().getId());
        List<MostrarPublicacionDTO> publicacionDTO = new ArrayList<>();
        for (Publicacion publicacion : publicaciones) {
            publicacionDTO.add(getPublicacionDTO(publicacion));
        }
        return publicacionDTO;
    }

    public Rol comprobarRol(Integer idUsuario) {
        Usuario usuario = usuarioRepositorio.findById(idUsuario).get();
        return usuario.getRol();
    }

    public List<MostrarPublicacionDTO> mostrarPublicacionesFeed(Integer idUsuario) {
        Usuario usuarioActual = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<Integer> amigosIds = amistadServicio.getAmistad(idUsuario)
                .stream()
                .map(ClienteDTO::getIdUsuario)
                .collect(Collectors.toList());
        amigosIds.add(idUsuario);


        List<Publicacion> publicacionesUsuarios = publicacionRepositorio.findByUsuario_IdIn(amigosIds);
        List<Publicacion> publicacionesEmpresas = publicacionRepositorio.findByUsuario_Rol(Rol.EMPRESA);

        Set<Publicacion> publicacionesCombinadas = new HashSet<>();
        publicacionesCombinadas.addAll(publicacionesUsuarios);
        publicacionesCombinadas.addAll(publicacionesEmpresas);

        List<Publicacion> publicacionesOrdenadas = new ArrayList<>(publicacionesCombinadas);
        publicacionesOrdenadas.sort((p1, p2) -> {
            int cmp = p2.getFecha().compareTo(p1.getFecha());
            return (cmp == 0) ? p2.getFecha().compareTo(p1.getFecha()) : cmp;
        });

        return publicacionesOrdenadas.stream()
                .map(PublicacionServicio::getPublicacionDTO)
                .collect(Collectors.toList());
    }
    public MostrarPublicacionDTO obtenerPublicacionPorId(Integer id) {
        Publicacion publicacion = publicacionRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicacion no encontrada"));
        return getPublicacionDTO(publicacion);
    }

    public List<ComentarioDTO> listarComentarios(int idPublicacion) {
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion)
                .orElseThrow(() -> new RuntimeException("ID de publicacion inexistente"));

        List<Comentario> listaComentarios = comentarioRepositorio.findByPublicacion(publicacion);
        List<ComentarioDTO> listaComentariosDTO = new ArrayList<>();
        for (Comentario comentario : listaComentarios) {
            listaComentariosDTO.add(ComentarioService.getComentarioDTO(comentario));
        }
        return listaComentariosDTO;
    }

}
