package org.example.donde_estas.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class TokenService {
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    /**
     * Genera el token de authorizacion para el usuario
     *
     * @param username Username que se guarda dentro del token
     * @param segundos tiempo de validez del token
     * @return token
     */
    public String generateToken(String username, int segundos) {
        Date exp = getExpiration(new Date(), segundos);
        
        return Jwts.builder()
                .subject(username)              
                .expiration(exp)                
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Valida si un token es válido
     *
     * @param token Token JWT a validar
     * @return true si es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extrae el username del token
     *
     * @param token Token JWT
     * @return Username contenido en el token
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private Date getExpiration(Date now, int segundos) {
        return new Date(now.getTime() + (segundos * 1000L));
    }
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}