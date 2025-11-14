package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="medallas")
public class Medalla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la medalla no puede estar vacío")
    private String nombre;

    @NotBlank(message = "La descripción de la medalla no puede estar vacía")
    private String descripcion;

    public Medalla(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Medalla() {

    }

}
