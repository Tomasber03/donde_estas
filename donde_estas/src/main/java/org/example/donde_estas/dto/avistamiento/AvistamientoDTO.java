package org.example.donde_estas.dto.avistamiento;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.model.Avistamiento;
import org.example.donde_estas.model.Ubicacion;

import java.time.LocalDateTime;
@Data
@Getter
@Setter
public class AvistamientoDTO {
    private LocalDateTime fechaCreacion;
    private String comentario;
    private String foto; // URL o path de la foto
    private Long usuarioId;
    private Ubicacion ubicacion;
    private Long publicacionId;

    public AvistamientoDTO() {}

    public AvistamientoDTO(Avistamiento avistamiento) {
        this.fechaCreacion = avistamiento.getFechaCreacion();
        this.comentario = avistamiento.getComentario();
        this.foto = avistamiento.getFoto();
        if (avistamiento.getUsuario() != null) {
            this.usuarioId = avistamiento.getUsuario().getId();
        }
        this.ubicacion = avistamiento.getUbicacion();
        if (avistamiento.getPublicacion() != null) {
            this.publicacionId = avistamiento.getPublicacion().getId();
        }
    }

}
