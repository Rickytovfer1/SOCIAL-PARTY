package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "empresa")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Empresa {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "codigoPostal", nullable = false)
    private String codigoPostal;

    @Column(name = "NIF", unique = true,  nullable = false)
    private String nif;

    @Column(name = "telelefono", unique = true,  nullable = false)
    private String telefono;

    @Column(name = "valoracion_minima", nullable = false)
    private Integer valoracionMinima;

    @Column(name = "edad_minima", nullable = false)
    private Integer edadMinima;

    @Column(name = "fotoPerfil")
    private String fotoPerfil;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Evento> eventos = new HashSet<>(0);

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Cliente> baneados = new HashSet<>(0);

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Usuario usuario;


}
