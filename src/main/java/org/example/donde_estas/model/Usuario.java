package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @Column(nullable = false)
    @Size(min = 8, message = "La clave debe tener al menos 8 caracteres")
    private String clave;

    @Email(message = "Ingresa un email valido")
    @Column(unique = true, nullable = false)
    private String email;

    private String telefono;
    private String barrio;
    private String ciudad;
    private RolPersistido rolPersistido;

    private int puntos = 0;

    @Transient
    private Rol rol;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Publicacion> publicaciones = new ArrayList<>();

    public Usuario(String nombre, String apellido, String clave, String email, String telefono, String barrio, String ciudad) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.clave = clave;
        this.email = email;
        this.telefono = telefono;
        this.barrio = barrio;
        this.ciudad = ciudad;
        this.rol = new UsuarioPublico();
        this.puntos = 0;
        this.publicaciones = new ArrayList<>();
    }

    public Usuario() {
        puntos = 0;
        this.rol = new UsuarioPublico();
    }

    public void agregarPublicacion(Publicacion pub){
        this.publicaciones.add(pub);
    }

}