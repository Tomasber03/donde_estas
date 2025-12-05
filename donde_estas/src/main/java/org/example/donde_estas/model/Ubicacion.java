package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="ubicaciones")
public class Ubicacion{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;
    @NotBlank(message = "El barrio es obligatorio")
    private String barrio;
    @NotBlank(message = "La latitud es obligatoria")
    private String latitud;
    @NotBlank(message = "La longitud es obligatoria")
    private String longitud;

    public Ubicacion (String ciudad, String barrio, String latitud, String longitud) {
        this.ciudad = ciudad;
        this.barrio = barrio;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    public Ubicacion() {

    }
    
}
