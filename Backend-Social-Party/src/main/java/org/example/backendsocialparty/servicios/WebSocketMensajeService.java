package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.MensajeDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketMensajeService {
    private final SimpMessagingTemplate messagingTemplate;
    public WebSocketMensajeService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    public void enviarMensaje(MensajeDTO mensaje) {
        messagingTemplate.convertAndSend("/topic/nuevoMensaje", mensaje);
    }
}
