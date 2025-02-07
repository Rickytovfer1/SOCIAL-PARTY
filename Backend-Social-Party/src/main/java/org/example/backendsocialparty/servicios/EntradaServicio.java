package org.example.backendsocialparty.servicios;

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
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.EmpresaRepositorio;
import org.example.backendsocialparty.repositorios.EntradaRepositorio;
import org.example.backendsocialparty.repositorios.EventoRepositorio;
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
import java.time.Period;
import java.util.*;

@Service
@AllArgsConstructor
public class EntradaServicio {

    private EntradaRepositorio entradaRepositorio;
    private EventoRepositorio eventoRepositorio;
    private ClienteRepositorio clienteRepositorio;
    private EmpresaRepositorio empresaRepositorio;

    @Transactional
    public void canjearEntrada(Integer codigoEntrada) {

        Entrada entrada = entradaRepositorio.findByCodigoEntrada(codigoEntrada);

        if (entrada == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entrada no encontrada");
        }
        Cliente cliente = clienteRepositorio.findById(entrada.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));

        Evento evento = eventoRepositorio.findById(entrada.getEvento().getId())
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));

        if (!evento.getAsistentes().contains(cliente)) {
            evento.getAsistentes().add(cliente);
            cliente.setEvento(evento);

            clienteRepositorio.save(cliente);

            System.out.println("Entrada con código " + codigoEntrada + " canjeada correctamente.");
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El cliente ya ha canjeado esta entrada.");
        }
    }

    public void comprarEntrada(Integer idEvento, Integer idEmpresa, Integer idCliente) {

        Cliente cliente = clienteRepositorio.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("No existe un cliente con este ID."));
        Empresa empresa = empresaRepositorio.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No existe una empresa con este ID."));
        Evento evento = eventoRepositorio.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("No existe un evento con este ID."));

        Period periodo = Period.between(cliente.getFechaNacimiento(), LocalDate.now());
        int edad = periodo.getYears();

        if (empresa.getEdadMinima() > edad || empresa.getBaneados().contains(cliente) || empresa.getValoracionMinima() > cliente.getValoracion()) {
            throw new RuntimeException("El cliente no es apto para entrar.");
        }

        Entrada entrada = new Entrada();
        entrada.setFecha(LocalDateTime.now());

        Random random = new Random();
        int codigoEntrada = 10000 + random.nextInt(90000);
        entrada.setCodigoEntrada(codigoEntrada);

        String qrData = "Evento: " + evento.getTitulo() + "\nCliente: " + cliente.getNombre() + "\nCódigo: " + codigoEntrada;
        byte[] qrBytes = generateQRBytes(qrData, 300, 300);
        if (qrBytes == null || qrBytes.length == 0) {
            throw new RuntimeException("Error: El código QR no se generó correctamente.");
        }

        entrada.setImagenQR(qrBytes);
        entrada.setCliente(cliente);
        entrada.setEvento(evento);

        System.out.println("Guardando entrada con código QR de " + qrBytes.length + " bytes");

        entradaRepositorio.save(entrada);
    }

    public void eliminarEntrada(Integer id) {
        List<Entrada> entradas = entradaRepositorio.findByCliente_Id(id);
        entradaRepositorio.deleteAll(entradas);
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
        dto.setEmpresa(getEmpresaEntradaDTO(evento.getEmpresa()));
        return dto;
    }

    private static EmpresaEntradaDTO getEmpresaEntradaDTO(Empresa empresa) {
        EmpresaEntradaDTO dto = new EmpresaEntradaDTO();
        dto.setId(empresa.getId());
        dto.setNombre(empresa.getNombre());
        dto.setFotoPerfil(empresa.getFotoPerfil());
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

}
