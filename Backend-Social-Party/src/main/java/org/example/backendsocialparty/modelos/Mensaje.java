// Mensaje.java
package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "mensaje")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Mensaje {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emisor", nullable = false)
    private Cliente emisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receptor", nullable = false)
    private Cliente receptor;

    @Column(name = "editado", nullable = false)
    private boolean editado = false;

    @Column(name = "borrado", nullable = false)
    private boolean borrado = false;
}
