package org.example.donde_estas.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UsuarioNuevoDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "La clave es obligatoria")
    private String clave;

    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message = "El telefono es obligatorio")
    private String telefono;

    @NotBlank(message = "El barrio es obligatorio")
    private String barrio;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;
}
