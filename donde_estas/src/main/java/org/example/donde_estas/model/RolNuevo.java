package org.example.donde_estas.model;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class RolNuevo {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    private String nombre;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "rol_permisos",
            joinColumns = @JoinColumn(name = "rol_id"),
            inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    private List<Permiso> permisos;
}
