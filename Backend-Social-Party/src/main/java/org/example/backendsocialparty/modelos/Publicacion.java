package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

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
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "foto", nullable = false)
    private String foto;

    @Column(name = "lugar", nullable = false)
    private String lugar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuario;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "comentarios")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Comentario> comentarios =  new HashSet<>(0);
}
