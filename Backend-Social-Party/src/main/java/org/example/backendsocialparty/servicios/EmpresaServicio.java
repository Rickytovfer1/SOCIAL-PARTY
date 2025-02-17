package org.example.backendsocialparty.servicios;

import lombok.RequiredArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmpresaServicio {

    @Value("${upload.dir:/tmp}")
    private String uploadDir;

    private final UsuarioServicio usuarioServicio;
    private final EmpresaRepositorio empresaRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final PublicacionServicio publicacionServicio;
    private final MensajeServicio mensajeServicio;
    private final SolicitudServicio solicitudServicio;
    private final AmistadServicio amistadServicio;
    private final EventoServicio eventoServicio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final EntradaServicio entradaServicio;
    private final NotificacionService notificacionService;
    public List<EmpresaDTO> listarEmpresas() {
        List<Empresa> empresas = empresaRepositorio.findAll();
        List<EmpresaDTO> empresasDTO = new ArrayList<>();
        for (Empresa empresa : empresas) {
            empresasDTO.add(convertirAEmpresaDTO(empresa));
        }
        return empresasDTO;
    }

    public Usuario verUsuarioEmpresa(Integer idEmpresa){
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        return usuarioRepositorio.findById(empresa.getUsuario().getId()).orElse(null);
    }
    public EmpresaDTO verEmpresa(Integer idEmpresa) {
        Empresa empresa = empresaRepositorio.getReferenceById(idEmpresa);
        return convertirAEmpresaDTO(empresa);
    }
    public EmpresaDTO verPerfilEmpresa(Integer idUsuario) {
        Empresa empresa = empresaRepositorio.findByUsuario_Id(idUsuario);
        return convertirAEmpresaDTO(empresa);
    }

    public void restarPuntosCliente(RestarPuntoDTO dto) {
        Cliente cliente = clienteRepositorio.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        cliente.setValoracion(cliente.getValoracion() - dto.getPuntos());
        clienteRepositorio.save(cliente);

        Empresa empresa = empresaRepositorio.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        NotificacionDTO notificacionDTO = new NotificacionDTO();
        notificacionDTO.setIdUsuario(cliente.getUsuario().getId());
        notificacionDTO.setTipo("restarPuntos");
        notificacionDTO.setMensaje("La empresa " + empresa.getNombre() +
                " te ha restado " + dto.getPuntos() + " puntos por " + dto.getMotivo() + ".");
        notificacionDTO.setIdReferencia(empresa.getId().longValue());

        notificacionService.enviarNotificacion(notificacionDTO);
    }



    public void eliminarEmpresa(Integer id) {
        Empresa empresa = empresaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        eventoServicio.eliminarBaneadoEmpresa(id);
        entradaServicio.eliminarEntradaEmpresa(id);
        usuarioServicio.eliminarUsuarioVerificacion(empresa.getUsuario().getId());
        eventoServicio.eliminarEvento(id);
        publicacionServicio.eliminarPublicacionEmpresa(id);
        empresaRepositorio.delete(empresa);
    }

    public String guardarFoto(MultipartFile foto) {
        if (foto == null || foto.isEmpty()) {
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

    public EmpresaDTO actualizarEmpresa(EmpresaDTO empresaDTO) {
        Empresa empresa = empresaRepositorio.findById(empresaDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe una empresa con este ID."));

        if (empresaDTO.getNombre() != null) {
            empresa.setNombre(empresaDTO.getNombre());
        }
        if (empresaDTO.getDireccion() != null) {
            empresa.setDireccion(empresaDTO.getDireccion());
        }
        if (empresaDTO.getCp() != null) {
            empresa.setCodigoPostal(empresaDTO.getCp());
        }
        if (empresaDTO.getNif() != null) {
            Optional<Empresa> empresaConNif = Optional.ofNullable(empresaRepositorio.findByNif(empresaDTO.getNif()));
            if (empresaConNif.isPresent() && !empresaConNif.get().getId().equals(empresaDTO.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El NIF ya está en uso");
            }
            empresa.setNif(empresaDTO.getNif());
        }
        if (empresaDTO.getTelefono() != null) {
            Optional<Empresa> empresaConTelefono = empresaRepositorio.findByTelefono(empresaDTO.getTelefono());
            if (empresaConTelefono.isPresent() && !empresaConTelefono.get().getId().equals(empresaDTO.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El teléfono ya está en uso");
            }
            empresa.setTelefono(empresaDTO.getTelefono());
        }

        if (empresaDTO.getCorreo() != null) {
            Usuario usuario = empresa.getUsuario();
            if (usuario != null) {
                if (!empresaDTO.getCorreo().equals(usuario.getCorreo())) {
                    Optional<Usuario> usuarioExistente = usuarioRepositorio.findTopByCorreo(empresaDTO.getCorreo());
                    if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo ya está en uso por otro usuario.");
                    }
                    usuario.setCorreo(empresaDTO.getCorreo());
                    usuarioRepositorio.save(usuario);
                }
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La empresa no está asociada a ningún usuario.");
            }
        }

        if (empresaDTO.getValoracionMinima() != null) {
            empresa.setValoracionMinima(empresaDTO.getValoracionMinima());
        }
        if (empresaDTO.getEdadMinima() != null) {
            empresa.setEdadMinima(empresaDTO.getEdadMinima());
        }
        if (empresaDTO.getFotoPerfil() != null) {
            empresa.setFotoPerfil(empresaDTO.getFotoPerfil());
        }

        Empresa empresaActualizada = empresaRepositorio.save(empresa);
        return convertirAEmpresaDTO(empresaActualizada);
    }





    private EmpresaDTO convertirAEmpresaDTO(Empresa e) {
        if (e == null) {
            return null;
        }
        EmpresaDTO dto = new EmpresaDTO();
        dto.setId(e.getId());
        dto.setNombre(e.getNombre());
        dto.setDireccion(e.getDireccion());
        dto.setCp(e.getCodigoPostal());
        dto.setNif(e.getNif());
        dto.setFotoPerfil(e.getFotoPerfil());
        dto.setTelefono(e.getTelefono());
        dto.setValoracionMinima(e.getValoracionMinima());
        dto.setEdadMinima(e.getEdadMinima());

        if (e.getUsuario() != null) {
            dto.setIdUsuario(e.getUsuario().getId());
        }

        if (e.getEventos() != null) {
            Set<Integer> eventosIds = new HashSet<>();
            e.getEventos().forEach(ev -> eventosIds.add(ev.getId()));
            dto.setEventos(eventosIds);
        }
        return dto;
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int lastIndex = filename.lastIndexOf(".");
        return (lastIndex == -1) ? "" : filename.substring(lastIndex + 1);
    }

    public void eliminarBaneadoCliente(Integer id) {
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

    public void banearDiscoteca(Integer idCliente,  Integer idEmpresa) {
        Cliente cliente = clienteRepositorio.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        Empresa empresa = empresaRepositorio.findById(idEmpresa).orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        Set<Cliente> baneados = new HashSet<>();
        baneados.add(cliente);
        empresa.setBaneados(baneados);

        for (Evento evento : empresa.getEventos()) {
            evento.getAsistentes().remove(cliente);
        }

        empresaRepositorio.save(empresa);

    }
}
