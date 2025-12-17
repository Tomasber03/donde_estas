package org.example.donde_estas.service;

import org.example.donde_estas.dto.auth.LoginRequest;
import org.example.donde_estas.dto.auth.LoginResponse;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private EncryptService encryptService;
    
    @Autowired
    private TokenService tokenService;
    
    @Value("${jwt.expiration:86400}")
    private int jwtExpiration;

    /**
     * Autentica un usuario validando sus credenciales
     * 
     * @param loginRequest Contiene email y contraseña
     * @return LoginResponse con token y datos del usuario
     * @throws ResponseStatusException si las credenciales son inválidas
     */
    public LoginResponse authenticate(LoginRequest loginRequest) {
        // Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, 
                        "Email o contraseña incorrectos"
                ));
        
        // Verificar contraseña
        if (!encryptService.verifyPassword(loginRequest.getClave(), usuario.getClave())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, 
                    "Email o contraseña incorrectos"
            );
        }
        
        // Generar token JWT
        String token = tokenService.generateToken(usuario.getEmail(), jwtExpiration);
        
        // Construir respuesta
        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                jwtExpiration
        );
    }
    
    /**
     * Valida si un token JWT es válido
     * 
     * @param token Token JWT a validar
     * @return true si es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        return tokenService.validateToken(token);
    }
    
    /**
     * Obtiene el usuario a partir de un token JWT
     * 
     * @param token Token JWT
     * @return Usuario autenticado
     */
    public Usuario getUserFromToken(String token) {
        String email = tokenService.getUsernameFromToken(token);
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, 
                        "Usuario no encontrado"
                ));
    }
}
