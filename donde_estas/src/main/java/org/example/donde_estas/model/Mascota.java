package org.example.donde_estas.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import org.example.donde_estas.dto.publicacion.MascotaDTO;

@Getter
@Setter
@Entity
@Table(name="mascotas")
public class Mascota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la mascota es obligatorio")
    private String nombre;

    private String raza;
    private String color;
    private String tamano;
    private String tipo;
    private String sexo;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Foto> fotos = new ArrayList<>();

    public Mascota(String nombre, String raza, String color, String tamano) {
        this.nombre = nombre;
        this.raza = raza;
        this.color = color;
        this.tamano = tamano;
    }
    public Mascota(MascotaDTO mascota)
    {
        this.id = mascota.getId();
        this.nombre = mascota.getNombre();
        this.raza = mascota.getRaza();
        this.color = mascota.getColor();
        this.tamano = mascota.getTamano();
        this.tipo = mascota.getTipo();
        this.sexo = mascota.getSexo();
    }
    
    public Mascota() {
    }
    
    public void addFoto(Foto foto) {
        fotos.add(foto);
        foto.setMascota(this);
    }
    
    @Override
    public String toString() {
        return "Mascota{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", raza='" + raza + '\'' +
                ", color='" + color + '\'' +
                ", tamano='" + tamano + '\'' +
                ", tipo='" + tipo + '\'' +
                '}';
    }
}