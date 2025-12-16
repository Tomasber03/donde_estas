package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.dto.publicacion.PublicacionDTO;
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

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "mascota_id")
    private Mascota mascota;

    @OneToMany(mappedBy = "publicacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avistamiento> avistamientos = new ArrayList<>();

    @OneToMany(mappedBy = "publicacion", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<Foto> fotos = new ArrayList<>();

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "usuario_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Usuario usuario;

    @Column(name = "estaActivo")
    private boolean activo = true;
    private Estado estadoInicial;
    private Estado estadoCierre;
    private LocalDateTime fechaInicial;
    private LocalDateTime fechaModificacion;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
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
    public Publicacion (PublicacionDTO dto){
        this.activo = dto.isActivo();
        this.estadoInicial = dto.getEstadoInicial();
        this.fechaInicial = LocalDateTime.now();
        this.estadoCierre = dto.getEstadoCierre();
        this.fechaModificacion = LocalDateTime.now();
        this.descripcion = dto.getDescripcion();
        this.mascota = dto.getMascota();
        this.ubicacion = dto.getUbicacion();
        this.usuario = null;
        this.fotos = dto.getFotos();
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
