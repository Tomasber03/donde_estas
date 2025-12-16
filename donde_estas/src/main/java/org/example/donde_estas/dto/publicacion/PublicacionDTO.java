package org.example.donde_estas.dto.publicacion;

import org.example.donde_estas.model.Foto;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.model.Ubicacion;
import org.example.donde_estas.model.Enum.Estado;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Getter
@Setter
public class PublicacionDTO {

    private Long id;
    private boolean activo;
    private Estado estadoInicial;
    private Estado estadoCierre;
    private LocalDateTime fechaInicial;
    private LocalDateTime fechaModificacion;
    private Mascota mascota;
    private Ubicacion ubicacion;
    private String descripcion;
    private Long usuarioId;
    private List<Foto> fotos;

    // si querés, datos “resumidos” de mascota y ubicación, pero no el usuario

    public PublicacionDTO(Publicacion pub) {
        this.id = pub.getId();
        this.activo = pub.isActivo();
        this.estadoInicial = pub.getEstadoInicial();
        this.estadoCierre = pub.getEstadoCierre();
        this.fechaInicial = pub.getFechaInicial();
        this.fechaModificacion = pub.getFechaModificacion();
        this.descripcion = pub.getDescripcion();
        this.usuarioId = pub.getUsuario() != null ? pub.getUsuario().getId() : null;
        this.mascota = pub.getMascota();
        this.ubicacion = pub.getUbicacion();
        this.fotos = pub.getFotos();

    }
    public PublicacionDTO() {
    }

    // getters/setters o Lombok
}