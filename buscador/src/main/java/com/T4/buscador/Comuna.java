package com.T4.buscador;

import jakarta.persistence.*;

@Entity
@Table(name = "comuna")
public class Comuna {
    @Id
    private Integer id;
    private String nombre;
}
