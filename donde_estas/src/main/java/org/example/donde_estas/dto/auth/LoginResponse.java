package org.example.donde_estas.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String nombre;
    private String rol; // Nombre del rol (ADMIN, USUARIO_PUBLICO, etc.)
    private int expiresIn; // Tiempo de expiración en segundos
}
