package com.T4.buscador;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avistamiento")
public class Avistamiento {
    @Id
    private Integer id;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voluntario_id")
    private Voluntario voluntario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ave_id")
    private Ave ave;
}
