package org.example.backendsocialparty.repositorios;

import org.example.backendsocialparty.modelos.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByIdUsuarioAndLeidoFalse(Integer idUsuario);
    Optional<Notificacion> findByIdUsuarioAndTipoAndIdReferenciaAndLeidoFalse(Integer idUsuario, String tipo, Long idReferencia);

}
