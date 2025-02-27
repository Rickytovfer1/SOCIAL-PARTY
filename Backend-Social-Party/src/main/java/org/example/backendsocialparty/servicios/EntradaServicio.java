package org.example.backendsocialparty.servicios;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.AllArgsConstructor;
import org.example.backendsocialparty.DTOs.*;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Empresa;
import org.example.backendsocialparty.modelos.Entrada;
import org.example.backendsocialparty.modelos.Evento;
import org.example.backendsocialparty.repositorios.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.util.*;

@Service
@AllArgsConstructor
public class EntradaServicio {

    private EntradaRepositorio entradaRepositorio;
    private EventoRepositorio eventoRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private EmpresaRepositorio empresaRepositorio;
    private UsuarioServicio usuarioServicio;
    private static final Logger logger = LoggerFactory.getLogger(EntradaServicio.class);
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void canjearEntrada(Integer codigoEntrada) {
        entityManagerFactory.getCache().evictAll();
        entityManager.clear();
        Entrada entrada = entradaRepositorio.findByCodigoEntrada(codigoEntrada);
        if (entrada == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entrada no encontrada");
        }

        Cliente cliente = clienteRepositorio.findById(entrada.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        Evento evento = eventoRepositorio.findById(entrada.getEvento().getId())
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));

        LocalDate hoy = LocalDate.now();
        LocalDate fechaEvento = evento.getFecha();
        LocalTime ahora = LocalTime.now();
        LocalTime horaApertura = evento.getHoraApertura();
        LocalTime horaFinalizacion = evento.getHoraFinalizacion();

        if (!hoy.equals(fechaEvento)) {
            if (fechaEvento.isAfter(hoy)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El evento se realizará el " + fechaEvento.toString() + " a las " + horaApertura.toString());
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El evento finalizó el " + fechaEvento.toString() + " a las " + horaFinalizacion.toString());
            }
        } else {
            if (ahora.isBefore(horaApertura)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El evento no ha iniciado. Inicia a las " + horaApertura.toString());
            } else if (ahora.isAfter(horaFinalizacion)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El evento ya finalizó. Finalizó a las " + horaFinalizacion.toString());
            }
        }

        Empresa empresa = empresaRepositorio.findById(evento.getEmpresa().getId())
                .orElseThrow(() -> new RuntimeException("No se encontró la empresa asociada al evento."));

        if (empresa.getBaneados().contains(cliente)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El cliente está baneado de esta discoteca.");
        }

        if (cliente.getEventos() != null && !cliente.getEventos().isEmpty()) {
            Evento eventoActual = cliente.getEventos().iterator().next();
            if (eventoActual.getId().equals(evento.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El cliente ya ha canjeado esta entrada.");
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El cliente está actualmente en otro evento.");
            }
        }

        evento.getAsistentes().add(cliente);

        cliente.getEventos().clear();
        cliente.getEventos().add(evento);
        eventoRepositorio.save(evento);
    }



    public EntradaDTO comprarEntrada(Integer idEvento, Integer idEmpresa, Integer idUsuario) {
        Integer idCliente = usuarioServicio.obtenerIdClientePorUsuario(idUsuario);

        Cliente cliente = clienteRepositorio.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));
        Evento evento = eventoRepositorio.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));

        Period periodo = Period.between(cliente.getFechaNacimiento(), LocalDate.now());
        int edad = periodo.getYears();

        StringBuilder errorMessage = new StringBuilder();

        if (empresa.getEdadMinima() > edad) {
            errorMessage.append("Edad insuficiente (edad: ")
                    .append(edad)
                    .append(", se requiere ")
                    .append(empresa.getEdadMinima())
                    .append("). ");
        }

        if (empresa.getBaneados().contains(cliente)) {
            errorMessage.append("El cliente está en la lista de baneados. ");
        }

        if (empresa.getValoracionMinima() > cliente.getValoracion()) {
            errorMessage.append("Valoración insuficiente (valoración: ")
                    .append(cliente.getValoracion())
                    .append(", se requiere ")
                    .append(empresa.getValoracionMinima())
                    .append("). ");
        }

        if (errorMessage.length() > 0) {
            logger.error("Cliente no apto para entrar. Detalles del cliente: {} | Fecha de nacimiento: {} | Edad calculada: {} | Empresa: {}",
                    cliente, cliente.getFechaNacimiento(), edad, empresa);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage.toString());
        }





        Entrada entrada = new Entrada();
        entrada.setFecha(LocalDateTime.now());
        Random random = new Random();
        int codigoEntrada = 10000 + random.nextInt(90000);
        entrada.setCodigoEntrada(codigoEntrada);
        entrada.setCliente(cliente);
        entrada.setEvento(evento);

        entradaRepositorio.save(entrada);

        byte[] qrBytes = generateQRBytes(String.valueOf(codigoEntrada), 250, 250);
        String base64QR = Base64.getEncoder().encodeToString(qrBytes);

        EntradaDTO dto = getEntradaDTO(entrada);
        dto.setQrCodeBase64(base64QR);

        return dto;
    }




    public void eliminarEntrada(Integer id) {
        List<Entrada> entradas = entradaRepositorio.findByCliente_Id(id);
        entradaRepositorio.deleteAll(entradas);
    }

//    public void eliminarEntradaEmpresa(Integer id) {
//        Empresa empresa = empresaRepositorio.findById(id)
//                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));
//
//        for (Evento evento : empresa.getEventos()) {
//            List<Cliente> clientes = clienteRepositorio.findByEvento_Id(evento.getId());
//
//            for (Cliente cliente : clientes) {
//                cliente.setEvento(null);
//                clienteRepositorio.save(cliente);
//            }
//
//            List<Entrada> entradas = entradaRepositorio.findByEvento_Id(evento.getId());
//            if (!entradas.isEmpty()) {
//                entradaRepositorio.deleteAll(entradas);
//            }
//        }
//    }

    public void eliminarEntradaEmpresa(Integer id) {
        Empresa empresa = empresaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));

        Set<Evento> eventos = empresa.getEventos();

        for (Evento evento : eventos) {
            // Obtener y eliminar las entradas asociadas al evento
            List<Entrada> entradas = entradaRepositorio.findByEvento_Id(evento.getId());
            if (!entradas.isEmpty()) {
                entradaRepositorio.deleteAll(entradas);
            }

            // Obtener y actualizar los clientes asociados al evento
            List<Cliente> clientes = clienteRepositorio.findClientesByEventosContains(evento);
            for (Cliente cliente : clientes) {
                cliente.getEventos().remove(evento); // Remover el evento de la lista del cliente
                clienteRepositorio.save(cliente); // Guardar el cliente actualizado
            }
        }

        // Finalmente, eliminar los eventos asociados a la empresa
        eventoRepositorio.deleteAll(eventos);
    }




    public List<EntradaDTO> listarEntradas(Integer idCliente) {
        List<Entrada> entradas = entradaRepositorio.findByCliente_Id(idCliente);
        List<EntradaDTO> entradaDTOS = new ArrayList<>();
        for (Entrada entrada : entradas) {
            entradaDTOS.add(getEntradaDTO(entrada));
        }
        return entradaDTOS;
    }

    private static EntradaDTO getEntradaDTO(Entrada a) {
        EntradaDTO dtonuevo = new EntradaDTO();
        dtonuevo.setId(a.getId());
        dtonuevo.setFecha(a.getFecha());
        dtonuevo.setCodigoEntrada(a.getCodigoEntrada());

        ClienteDTO dto = new ClienteDTO();
        dto.setId(a.getCliente().getId());
        dtonuevo.setCliente(dto);

        dtonuevo.setEvento(getEventoEntradaDTO(a.getEvento()));
        return dtonuevo;
    }



    private static EventoEntradaDTO getEventoEntradaDTO(Evento evento) {
        EventoEntradaDTO dto = new EventoEntradaDTO();
        dto.setId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setFecha(evento.getFecha().toString());
        dto.setHoraApertura(evento.getHoraApertura().toString());
        dto.setHoraFinalizacion(evento.getHoraFinalizacion().toString());
        dto.setPrecio(evento.getPrecio());
        dto.setEmpresa(getEmpresaEntradaDTO(evento.getEmpresa()));
        return dto;
    }


    private static EmpresaEntradaDTO getEmpresaEntradaDTO(Empresa empresa) {
        EmpresaEntradaDTO dto = new EmpresaEntradaDTO();
        dto.setId(empresa.getId());
        dto.setNombre(empresa.getNombre());
        dto.setFotoPerfil(empresa.getFotoPerfil());
        dto.setDireccion(empresa.getDireccion());
        return dto;
    }


    public byte[] generateQRBytes(String data, int width, int height) {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        try {
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height, hints);
            BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            byte[] qrBytes = baos.toByteArray();

            System.out.println("QR generado, tamaño: " + qrBytes.length + " bytes");

            return qrBytes;
        } catch (WriterException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al generar el código QR", e);
        }
    }
    public List<EntradaDTO> listarEntradasActivas(Integer idCliente) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<Entrada> entradas = entradaRepositorio.findEntradasActivas(idCliente, today, now);
        List<EntradaDTO> entradasActivas = new ArrayList<>();
        for (Entrada entrada : entradas) {
            entradasActivas.add(getEntradaDTO(entrada));
        }
        return entradasActivas;
    }
    public EntradaDTO getEntradaById(Integer id) {
        Entrada entrada = entradaRepositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entrada no encontrada"));
        EntradaDTO dto = getEntradaDTO(entrada);
        byte[] qrBytes = generateQRBytes(String.valueOf(entrada.getCodigoEntrada()), 250, 250);
        String base64QR = Base64.getEncoder().encodeToString(qrBytes);
        dto.setQrCodeBase64(base64QR);

        return dto;
    }




}
