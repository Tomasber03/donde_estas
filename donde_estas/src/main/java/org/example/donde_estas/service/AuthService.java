package org.example.donde_estas.service;

import org.example.donde_estas.dto.auth.LoginRequest;
import org.example.donde_estas.dto.auth.LoginResponse;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
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

    public LoginResponse authenticate(LoginRequest loginRequest) {
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, 
                        "Email o contraseña incorrectos"
                ));
        
        if (!encryptService.verifyPassword(loginRequest.getClave(), usuario.getClave())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, 
                    "Email o contraseña incorrectos"
            );
        }
        
        String token = tokenService.generateToken(usuario.getEmail(), jwtExpiration);
        
        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getRolNuevo() != null ? usuario.getRolNuevo().getNombre() : "USUARIO_PUBLICO",
                jwtExpiration
        );
    }
    
    public boolean validateToken(String token) {
        return tokenService.validateToken(token);
    }
    
    public Usuario getUserFromToken(String token) {
        String email = tokenService.getUsernameFromToken(token);
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("Usuario no encontrado en el token"
                ));
    }

    public LoginResponse getUserInfoFromToken(String token) {
        Usuario usuario = getUserFromToken(token);
        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                jwtExpiration
        );
    }
}
