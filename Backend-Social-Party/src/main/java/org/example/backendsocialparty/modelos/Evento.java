package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "evento")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor

public class Evento {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "horaApertura", nullable = false)
    private LocalTime horaApertura;

    @Column(name = "horaFinalizacion", nullable = false)
    private LocalTime horaFinalizacion;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "foto", nullable = false)
    private String foto;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa")
    private Empresa empresa;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private Set<Entrada> entradas = new HashSet<>(0);

    @OneToMany(cascade = CascadeType.ALL)
    private Set<Cliente> asistentes = new HashSet<>(0);

}
