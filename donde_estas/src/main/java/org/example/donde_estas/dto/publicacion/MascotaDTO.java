package org.example.donde_estas.dto.publicacion;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class MascotaDTO {
    private Long id; // Si existe, se usa la mascota existente
    private String nombre;
    private String raza;
    private String color;
    private String tamano;
    private String tipo;
    private String sexo;
    
    public MascotaDTO() {
    }
}
