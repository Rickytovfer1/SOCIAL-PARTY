package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "publicacion")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Publicacion {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "foto", nullable = false)
    private String foto;

    @Column(name = "direccion")
    private String direccion;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}
