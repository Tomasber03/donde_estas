package org.example.donde_estas.dto.usuario;

import org.example.donde_estas.dto.publicacion.PublicacionDTO;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.model.Usuario;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Data
@Getter
@Setter

public class UsuarioDetalleDTO {

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String barrio;
    private String ciudad;
    private int puntos;
    private List<PublicacionDTO> publicaciones;

    public UsuarioDetalleDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
        this.barrio = usuario.getBarrio();
        this.ciudad = usuario.getCiudad();
        this.puntos = usuario.getPuntos();
        if (usuario.getPublicaciones() != null) {
            this.publicaciones = usuario.getPublicaciones().stream()
                    .map(PublicacionDTO::new)
                    .toList();
        } else {
            this.publicaciones = Collections.emptyList();
        }
    }
    @Override
    public String toString() {
        return "UsuarioDetalleDTO{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", barrio='" + barrio + '\'' +
                ", ciudad='" + ciudad + '\'' +
                ", puntos=" + puntos +
                '}';
    }
    // getters y setters (o Lombok @Getter/@Setter)
}