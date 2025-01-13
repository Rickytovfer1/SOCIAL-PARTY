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
    private int id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "codigoPostal", nullable = false)
    private String codigoPostal;

    @Column(name = "correoElectronico", unique = true,  nullable = false)
    private String correoElectronico;

    @Column(name = "contrasena",  nullable = false)
    private String contrasena;

    @Column(name = "NIF", unique = true,  nullable = false)
    private String nif;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    private Set<Evento> eventos = new HashSet<>(0);
}
