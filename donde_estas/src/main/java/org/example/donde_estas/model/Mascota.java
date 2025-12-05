package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="mascotas")
public class Mascota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la mascota es obligatorio")
    private String nombre;

    private String raza;
    private String color;
    private String tamano;
    private String tipo;

    public Mascota(String nombre, String raza, String color, String tamano) {
        this.nombre = nombre;
        this.raza = raza;
        this.color = color;
        this.tamano = tamano;
    }
    public Mascota() {
    }


}