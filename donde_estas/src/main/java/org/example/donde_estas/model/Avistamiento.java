package org.example.donde_estas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.dto.avistamiento.AvistamientoDTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="avistamientos")
public class Avistamiento{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comentario;
    private LocalDateTime fechaCreacion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario usuario;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Ubicacion ubicacion;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "publicacion_id")
    private Publicacion publicacion;

    @OneToMany(mappedBy = "avistamiento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Foto> fotos = new ArrayList<>();

    public Avistamiento(String comentario, Usuario usuario, Ubicacion ubicacion, Publicacion publicacion) {
        this.comentario = comentario;
        this.fechaCreacion = LocalDateTime.now();
        this.usuario = usuario;
        this.ubicacion = ubicacion;
        this.publicacion = publicacion;
    }
    public Avistamiento(AvistamientoDTO dto) {
        this.comentario = dto.getComentario();
        this.fechaCreacion = dto.getFechaCreacion();
        this.fotos = dto.getFotos();
    }

    public Avistamiento() {

    }
    @Override
    public String toString() {
        return "Avistamiento{" +
                "id=" + id +
                ", comentario='" + comentario + '\'' +
                ", fechaCreacion=" + fechaCreacion +
                ", usuario=" + (usuario != null ? usuario.getId() : null) +
                ", ubicacion=" + ubicacion +
                ", publicacion=" + (publicacion != null ? publicacion.getId() : null) +
                ", fotos=" + fotos +
                '}';
    }
}