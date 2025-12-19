package org.example.donde_estas.dto.publicacion;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.model.Mascota;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Getter
@Setter
public class MascotaConFotosDTO {
    private Long id;
    private String nombre;
    private String raza;
    private String color;
    private String tamano;
    private String tipo;
    private List<FotoDTO> fotos;
    
    public MascotaConFotosDTO() {
    }
    
    public MascotaConFotosDTO(Mascota mascota) {
        this.id = mascota.getId();
        this.nombre = mascota.getNombre();
        this.raza = mascota.getRaza();
        this.color = mascota.getColor();
        this.tamano = mascota.getTamano();
        this.tipo = mascota.getTipo();
        
        if (mascota.getFotos() != null) {
            this.fotos = mascota.getFotos().stream()
                .map(foto -> {
                    FotoDTO dto = new FotoDTO();
                    dto.setNombre(foto.getNombre());
                    dto.setUrl(foto.getUrl());
                    dto.setDescripcion(foto.getDescripcion());
                    return dto;
                })
                .collect(Collectors.toList());
        } else {
            this.fotos = new ArrayList<>();
        }
    }
}
