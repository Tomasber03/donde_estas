package org.example.donde_estas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.model.Enum.Estado;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "publicaciones")
public class Publicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne (cascade = CascadeType.ALL)
    @JoinColumn(name = "mascota_id")
    private Mascota mascota;

    @OneToMany(mappedBy = "publicacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avistamiento> avistamientos;
    @ManyToOne (cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    private boolean estaActivo;
    private Estado estadoInicial;
    private Estado estadoCierre;
    private LocalDateTime fechaInicial;
    private LocalDateTime fechaCierre;

    @OneToOne(cascade = CascadeType.ALL)
    private Ubicacion ubicacion;

    public Publicacion(Usuario usuario, boolean estaActivo, Estado estadoInicial, LocalDateTime fechaInicial, Ubicacion ubicacion, Mascota mascota) {
        super();
        this.usuario = usuario;
        this.estaActivo = estaActivo;
        this.estadoInicial = estadoInicial;
        this.fechaInicial = fechaInicial;
        this.ubicacion = ubicacion;
        this.mascota = mascota;
    }

    public Publicacion(){
        estaActivo = true;
        fechaInicial = LocalDateTime.now();
        avistamientos = new ArrayList<>();
    }
}
