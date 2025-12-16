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
    private String url;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private boolean esDePublicacion;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Publicacion publicacion;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Avistamiento avistamiento;


    public Foto(String url, boolean esDePublicacion) {
        this.url = url;
        this.fechaCreacion = LocalDateTime.now();
        this.esDePublicacion = esDePublicacion;
    }
    public Foto() {
    }
}