package org.example.donde_estas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.dto.avistamiento.AvistamientoDTO;

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
    private LocalDateTime fechaCreacion;
    private boolean esDePublicacion;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Publicacion publicacion;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Avistamiento avistamiento;
    

    public Foto(String url) {
        this.url = url;
        this.fechaCreacion = LocalDateTime.now();
    }
    public Foto() {
    }
}