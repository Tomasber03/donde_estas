package org.example.donde_estas.dto.publicacion;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PublicacionModificadaDTO {

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @NotBlank
    private Long idMascota;

}
