package org.example.donde_estas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name="avistamientos")
public class Avistamiento{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comentario;
    private String foto; // URL o path de la foto
    private LocalDateTime fechaCreacion;

    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario usuario;
    @OneToOne(fetch = FetchType.LAZY)
    private Ubicacion ubicacion;
    @ManyToOne
    @JoinColumn(name = "publicacion_id")
    private Publicacion publicacion;

    public Publicacion getPublicacion() {
        return publicacion;
    }

    public void setPublicacion(Publicacion publicacion) {
        this.publicacion = publicacion;
    }
    // private Foto ?


}