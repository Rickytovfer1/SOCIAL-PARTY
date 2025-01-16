package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor

public class Cliente {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellidos", nullable = false)
    private String apellidos;

    @Column(name = "correoElectronico", unique = true,  nullable = false)
    private String correoElectronico;

    @Column(name = "contrasena",  nullable = false)
    private String contrasena;

    @Column(name = "DNI", unique = true,  nullable = false)
    private String dni;

    @Column(name = "valoracion",  nullable = false)
    private Integer valoracion;

    @Column(name = "telelefono", unique = true,  nullable = false)
    private String telefono;

    @OneToMany(mappedBy = "usuario1", cascade = CascadeType.ALL)
    private Set<Amistad> amistades = new HashSet<>(0);

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private Set<Entrada> entrada = new HashSet<>(0);

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "usuarios")
    private Set<Grupo> grupos = new HashSet<>(0);

    @OneToOne(fetch = FetchType.LAZY)
    private Usuario usuario;
}
