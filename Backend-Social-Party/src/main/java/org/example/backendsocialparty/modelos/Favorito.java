package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorito")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Favorito {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Publicacion publicacion;
}
