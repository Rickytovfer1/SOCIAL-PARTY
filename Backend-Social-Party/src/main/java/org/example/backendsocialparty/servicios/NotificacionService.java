package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.NotificacionDTO;
import java.util.List;

public interface NotificacionService {
    void enviarNotificacion(NotificacionDTO notificacionDTO);
    List<NotificacionDTO> obtenerNotificacionesNoLeidas(Integer userId);
    void marcarComoLeida(Long notificacionId);
}
