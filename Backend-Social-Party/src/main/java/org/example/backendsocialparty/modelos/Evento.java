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
    private Integer id;

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

    @Column(name = "precio", nullable = false)
    private Double precio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa")
    private Empresa empresa;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Entrada> entradas = new HashSet<>(0);

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "evento_asistentes",
            joinColumns = @JoinColumn(name = "evento_id"),
            inverseJoinColumns = @JoinColumn(name = "asistentes_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Cliente> asistentes = new HashSet<>();



    public void removerAsistente(Cliente cliente) {
        this.asistentes.remove(cliente);
        if (cliente.getEventos() != null) {
            cliente.getEventos().clear();
        }
    }


}
