package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "grupo")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Grupo {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nombre")
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "creador")
    private Cliente creador;

    @ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, targetEntity = Cliente.class)
    @JoinTable(name = "cliente_grupo",
            joinColumns = {@JoinColumn(name = "idGrupo", nullable = false)} ,
            inverseJoinColumns ={@JoinColumn(name = "idCliente", nullable = false)})
    private Set<Cliente> usuarios = new HashSet<>(0);


}
