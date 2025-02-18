package org.example.backendsocialparty.controladores;

import org.example.backendsocialparty.DTOs.NotificacionDTO;
import org.example.backendsocialparty.servicios.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping("/no-leidas/{userId}")
    public List<NotificacionDTO> obtenerNotificacionesNoLeidas(@PathVariable Integer userId) {
        return notificacionService.obtenerNotificacionesNoLeidas(userId);
    }

    @PutMapping("/marcarLeida/{notificacionId}")
    public void marcarNotificacionComoLeida(@PathVariable Long notificacionId) {
        notificacionService.marcarComoLeida(notificacionId);
    }
}
