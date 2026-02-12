package org.example.donde_estas.dto.publicacion;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.donde_estas.dto.publicacion.UbicacionDTO;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PublicacionModificadaDTO {

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    private Long idMascota;
    
    private UbicacionDTO ubicacionDTO;

}
