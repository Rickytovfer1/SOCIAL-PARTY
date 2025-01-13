package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "amistad")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Amistad {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario1")
    private Cliente usuario1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario2")
    private Cliente usuario2;







}
