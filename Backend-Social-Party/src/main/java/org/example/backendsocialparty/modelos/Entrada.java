package org.example.backendsocialparty.modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "entrada")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Entrada {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "codigoEntrada")
    private Integer codigoEntrada;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Evento evento;

    @Embedded
    private QRCode qrCode;
}