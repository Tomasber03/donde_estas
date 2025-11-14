package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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


    private boolean activo;
    private Estado estadoInicial;
    private Estado estadoCierre;
    private LocalDateTime fechaInicial;
    private LocalDateTime fechaModificacion;

    @OneToOne(cascade = CascadeType.ALL)
    private Ubicacion ubicacion;

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    public Publicacion(Usuario usuario, boolean estaActivo, Estado estadoInicial, Ubicacion ubicacion, Mascota mascota) {
        super();
        this.usuario = usuario;
        this.activo = estaActivo;
        this.estadoInicial = estadoInicial;
        this.fechaInicial = LocalDateTime.now();
        this.ubicacion = ubicacion;
        this.mascota = mascota;
    }

    public Publicacion(){
        activo = true;
        fechaInicial = LocalDateTime.now();
        fechaModificacion = LocalDateTime.now();
        avistamientos = new ArrayList<>();
    }

    public void recuperado() {
        this.activo = false;
        this.estadoCierre = Estado.RECUPERADO;
        this.fechaModificacion = LocalDateTime.now();
    }

    public void adoptado() {
        this.activo = false;
        this.estadoCierre = Estado.ADOPTADO;
        this.fechaModificacion = LocalDateTime.now();
    }
}
