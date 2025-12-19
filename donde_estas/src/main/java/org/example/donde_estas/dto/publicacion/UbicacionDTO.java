package org.example.donde_estas.dto.publicacion;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UbicacionDTO {
    private String ciudad;
    private String barrio;
    private String latitud;
    private String longitud;
    
    public UbicacionDTO() {
    }
}
