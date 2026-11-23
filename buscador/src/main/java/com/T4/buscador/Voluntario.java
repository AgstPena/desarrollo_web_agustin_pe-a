package com.T4.buscador;

import jakarta.persistence.*;

@Entity
@Table(name = "voluntario")
public class Voluntario {
    @Id
    private Integer id;
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;
}
