package org.example.donde_estas.model;

import jakarta.persistence.*;

@Entity
@Table(name="ubicaciones")
public class Ubicacion{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ciudad;
    private String barrio;
    private String latitud;
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
