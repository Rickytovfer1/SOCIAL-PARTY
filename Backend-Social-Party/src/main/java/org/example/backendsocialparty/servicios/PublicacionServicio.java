package org.example.backendsocialparty.servicios;

import lombok.RequiredArgsConstructor;
import org.example.backendsocialparty.DTOs.ClientePublicacionDTO;
import org.example.backendsocialparty.DTOs.MostrarPublicacionDTO;
import org.example.backendsocialparty.DTOs.PublicacionDTO;
import org.example.backendsocialparty.enumerados.Rol;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublicacionServicio {

    private final PublicacionRepositorio publicacionRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final EmpresaRepositorio empresaRepositorio;

    @Value("${upload.dir}")
    private String uploadDir;

    public void guardarPublicacion(PublicacionDTO dto, MultipartFile foto) {
        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setTexto(dto.getTexto());
        publicacion.setTitulo(dto.getTitulo());
        publicacion.setHora(LocalTime.now());
        publicacion.setFecha(LocalDate.now());

        String fotoUrl = guardarImagen(foto);
        publicacion.setFoto(fotoUrl);

        publicacion.setDireccion(dto.getDireccion());

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
        publicacion.setTexto(dto.getTexto());
        publicacion.setHora(LocalTime.now());
        publicacion.setFecha(LocalDate.now());

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

    private static MostrarPublicacionDTO getPublicacionDTO(Publicacion p) {
        MostrarPublicacionDTO publicacionDTO = new MostrarPublicacionDTO();
        publicacionDTO.setId(p.getId());
        publicacionDTO.setTexto(p.getTexto());
        publicacionDTO.setHora(p.getHora());
        publicacionDTO.setFecha(p.getFecha());
        publicacionDTO.setFoto(p.getFoto());
        publicacionDTO.setTitulo(p.getTitulo());
        publicacionDTO.setDireccion(p.getDireccion()); // Corregido: anteriormente era p.getFoto()
        publicacionDTO.setIdUsuario(p.getUsuario().getId());
        return publicacionDTO;
    }

    public void eliminarPublicacion(Integer id){
        List<Publicacion> publicaciones = publicacionRepositorio.findPublicacionesByUsuario_Id(id);

        for (Publicacion publicacion: publicaciones){

            if (publicacion.getUsuario().getRol() == Rol.CLIENTE){

                Cliente cliente = clienteRepositorio.findByUsuario_Id(publicacion.getUsuario().getId());

                if (Objects.equals(cliente.getUsuario().getId(), publicacion.getUsuario().getId())){
                    publicacionRepositorio.deleteAll(publicaciones);
                }
            }
            if (publicacion.getUsuario().getRol() == Rol.EMPRESA){

                Empresa empresa = empresaRepositorio.findByUsuario_Id(publicacion.getUsuario().getId());
                if (Objects.equals(empresa.getUsuario().getId(), publicacion.getUsuario().getId())){
                    publicacionRepositorio.deleteAll(publicaciones);
                }
            }
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

}
