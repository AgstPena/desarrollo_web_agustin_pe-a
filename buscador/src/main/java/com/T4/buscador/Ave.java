package com.T4.buscador;

import jakarta.persistence.*;

@Entity
@Table(name = "ave")
public class Ave {
    @Id
    private Integer id;
    private String nombre;
}
