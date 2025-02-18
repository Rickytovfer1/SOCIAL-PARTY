package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.NotificacionDTO;
import org.example.backendsocialparty.modelos.Notificacion;
import org.example.backendsocialparty.repositorios.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void enviarNotificacion(NotificacionDTO notificacionDTO) {
        Optional<Notificacion> optionalNotificacion = notificacionRepository
                .findByIdUsuarioAndTipoAndIdReferenciaAndLeidoFalse(
                        notificacionDTO.getIdUsuario(),
                        notificacionDTO.getTipo(),
                        notificacionDTO.getIdReferencia()
                );

        Notificacion notificacion;
        if(optionalNotificacion.isPresent()){
            notificacion = optionalNotificacion.get();
            notificacion.setFecha(LocalDateTime.now());
            notificacion.setMensaje(notificacionDTO.getMensaje());
        } else {
            notificacion = new Notificacion();
            notificacion.setIdUsuario(notificacionDTO.getIdUsuario());
            notificacion.setTipo(notificacionDTO.getTipo());
            notificacion.setMensaje(notificacionDTO.getMensaje());
            notificacion.setFecha(LocalDateTime.now());
            notificacion.setLeido(false);
            notificacion.setIdReferencia(notificacionDTO.getIdReferencia());
        }
        Notificacion notificacionGuardada = notificacionRepository.save(notificacion);
        notificacionDTO.setId(notificacionGuardada.getId());
        notificacionDTO.setFecha(notificacionGuardada.getFecha());
        messagingTemplate.convertAndSend("/topic/notificaciones/" + notificacionDTO.getIdUsuario(), notificacionDTO);
    }


    @Override
    public List<NotificacionDTO> obtenerNotificacionesNoLeidas(Integer idUsuario) {
        List<Notificacion> notificaciones = notificacionRepository.findByIdUsuarioAndLeidoFalse(idUsuario);
        return notificaciones.stream()
                .map(n -> new NotificacionDTO(
                        n.getId(),
                        n.getIdUsuario(),
                        n.getTipo(),
                        n.getMensaje(),
                        n.getFecha(),
                        n.getIdReferencia()))
                .collect(Collectors.toList());
    }

    @Override
    public void marcarComoLeida(Long idNotificacion) {
        Notificacion notificacion = notificacionRepository.findById(idNotificacion)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notificacion.setLeido(true);
        notificacionRepository.save(notificacion);
    }
}
