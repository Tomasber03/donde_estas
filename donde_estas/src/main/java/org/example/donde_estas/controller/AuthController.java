package org.example.donde_estas.controller;

import org.example.donde_estas.dto.auth.LoginRequest;
import org.example.donde_estas.dto.auth.LoginResponse;
import org.example.donde_estas.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    /**
     * Endpoint de login - Autentica usuario y devuelve token JWT
     * 
     * @param loginRequest Contiene email y contraseña
     * @return LoginResponse con token y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para validar si un token es válido
     * 
     * @param authHeader Header Authorization con el token Bearer
     * @return true si el token es válido, false en caso contrario
     */
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}
