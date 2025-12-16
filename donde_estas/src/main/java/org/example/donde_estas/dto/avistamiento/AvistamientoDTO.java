package org.example.donde_estas.dto.avistamiento;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.model.Avistamiento;
import org.example.donde_estas.model.Foto;
import org.example.donde_estas.model.Ubicacion;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
public class AvistamientoDTO {
    private LocalDateTime fechaCreacion;
    private String comentario;
    private Long usuarioId;
    private Ubicacion ubicacion;
    private Long publicacionId;
    private List<Foto> fotos;

    public AvistamientoDTO() {}

    public AvistamientoDTO(Avistamiento avistamiento) {
        this.fechaCreacion = avistamiento.getFechaCreacion();
        this.comentario = avistamiento.getComentario();
        if (avistamiento.getUsuario() != null) {
            this.usuarioId = avistamiento.getUsuario().getId();
        }
        this.ubicacion = avistamiento.getUbicacion();
        this.fotos = avistamiento.getFotos();
        if (avistamiento.getPublicacion() != null) {
            this.publicacionId = avistamiento.getPublicacion().getId();
        }
    }

}
