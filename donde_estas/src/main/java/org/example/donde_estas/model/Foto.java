package org.example.donde_estas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name="fotos")
public class Foto{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    @Column(length = 16777215) // MEDIUMTEXT en MySQL - para almacenar Base64
    private String url;
    private LocalDateTime fechaCreacion;
    private boolean esDePublicacion;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_id")
    private Publicacion publicacion;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avistamiento_id")
    private Avistamiento avistamiento;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mascota_id")
    private Mascota mascota;

    public Foto(String nombre, String url) {
        this.nombre = nombre;
        this.url = url;
        this.fechaCreacion = LocalDateTime.now();
        this.esDePublicacion = false;
    }
    
    public Foto() {
    }
}