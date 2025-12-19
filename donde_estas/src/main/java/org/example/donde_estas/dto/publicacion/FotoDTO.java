package org.example.donde_estas.dto.publicacion;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class FotoDTO {
    private String nombre;
    private String descripcion;
    private String url; // Base64 string
    
    public FotoDTO() {
    }
    
    public FotoDTO(String nombre, String url) {
        this.nombre = nombre;
        this.url = url;
    }
}
