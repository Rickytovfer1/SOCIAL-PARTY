package org.example.backendsocialparty.DTOs;

import java.time.LocalDateTime;

public class NotificacionDTO {
    private Long id;
    private Integer idUsuario;
    private String tipo;
    private String mensaje;
    private LocalDateTime fecha;
    private Long idReferencia;

    public NotificacionDTO() {}

    public NotificacionDTO(Long id, Integer idUsuario, String tipo, String mensaje, LocalDateTime fecha, Long idReferencia) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.fecha = fecha;
        this.idReferencia = idReferencia;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Long getIdReferencia() { return idReferencia; }
    public void setIdReferencia(Long idReferencia) { this.idReferencia = idReferencia; }
}
