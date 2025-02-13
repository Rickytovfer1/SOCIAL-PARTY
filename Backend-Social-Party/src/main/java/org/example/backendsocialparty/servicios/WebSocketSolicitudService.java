package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.SolicitudDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WebSocketSolicitudService {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketSolicitudService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void enviarSolicitudCreada(SolicitudDTO solicitud) {
        System.out.println("Sending solicitud event to topic /topic/solicitudes/" + solicitud.getIdUsuario2() + ": " + solicitud);
        messagingTemplate.convertAndSend("/topic/solicitudes/" + solicitud.getIdUsuario2(),
                Map.of("action", "create", "solicitud", solicitud));
    }


}

