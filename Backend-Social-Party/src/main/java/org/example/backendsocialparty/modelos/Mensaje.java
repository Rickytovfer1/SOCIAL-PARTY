package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    private int id;

    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emisor")
    private Cliente emisor;

    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Cliente> receptor = new HashSet<>(0);
}
