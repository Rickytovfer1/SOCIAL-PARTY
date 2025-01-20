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

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Cliente usuario;

    @ManyToOne
    @JoinColumn(name = "amigo_id")
    private Cliente amigo;








}
