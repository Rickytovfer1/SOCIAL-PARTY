package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.MensajeDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketMensajeService {
    private final SimpMessagingTemplate messagingTemplate;
    public WebSocketMensajeService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    private Map<String, Object> createMessage(String action, MensajeDTO mensaje) {
        Map<String, Object> data = new HashMap<>();
        data.put("action", action);
        data.put("mensaje", mensaje);
        return data;
    }
    public void enviarMensaje(MensajeDTO mensaje) {
        messagingTemplate.convertAndSend("/topic/nuevoMensaje", createMessage("create", mensaje));
    }
    public void enviarMensajeEditado(MensajeDTO mensaje) {
        messagingTemplate.convertAndSend("/topic/mensajeEditado", createMessage("update", mensaje));
    }
    public void enviarMensajeEliminado(MensajeDTO mensaje) {
        messagingTemplate.convertAndSend("/topic/mensajeEliminado", createMessage("delete", mensaje));
    }
}
