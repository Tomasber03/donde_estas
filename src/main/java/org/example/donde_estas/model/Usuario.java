package org.example.donde_estas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.example.donde_estas.dto.usuario.UsuarioNuevoDTO;
import org.example.donde_estas.model.Enum.RolPersistido;

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

    @NotBlank(message = "El telefono es obligatorio")
    private String telefono;

    @NotBlank(message = "El barrio es obligatorio")
    private String barrio;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;

    @Enumerated(EnumType.STRING)
    private RolPersistido rolPersistido;

    private int puntos;

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
        this.puntos = 0;
        // se carga el rol con el service
    }
    public Usuario (UsuarioNuevoDTO dto)
    {
        this.nombre = dto.getNombre();
        this.apellido = dto.getApellido();
        this.clave = dto.getClave();
        this.email = dto.getEmail();
        this.telefono = dto.getTelefono();
        this.barrio = dto.getBarrio();
        this.ciudad = dto.getCiudad();
        this.rol = new UsuarioPublico();
        this.puntos = 0;
        this.publicaciones = new ArrayList<>();
        this.rolPersistido = dto.getRolPersistido();
    }

    public Usuario() {
        puntos = 0;
        this.rol = new UsuarioPublico();
    }

    public void agregarPublicacion(Publicacion pub){
        this.publicaciones.add(pub);
    }

}