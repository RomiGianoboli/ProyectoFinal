package com.derwe.parent.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret:derweparent-secret-key-2025-Universidad-Siglo21-RominaGianoboli-TFG}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}") // 24 horas por defecto
    private Long expiration;
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String generarToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return crearToken(claims, email);
    }
    
    public String generarToken(Long padreId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        return crearToken(claims, padreId.toString());
    }
    
    private String crearToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String extraerPadreId(String token) {
        return extraerClaim(token, Claims::getSubject);
    }
    
    public String extraerEmail(String token) {
        Claims claims = extraerTodosClaims(token);
        return claims.get("email", String.class);
    }
    
    public Date extraerExpiracion(String token) {
        return extraerClaim(token, Claims::getExpiration);
    }
    
    public <T> T extraerClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraerTodosClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extraerTodosClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Boolean esTokenExpirado(String token) {
        return extraerExpiracion(token).before(new Date());
    }
    
    public Boolean validarToken(String token, String email) {
        final String emailDelToken = extraerEmail(token);
        return (emailDelToken.equals(email) && !esTokenExpirado(token));
    }
    
    public Boolean validarToken(String token) {
        try {
            return !esTokenExpirado(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    public Long getExpiracion() {
        return expiration;
    }
}
