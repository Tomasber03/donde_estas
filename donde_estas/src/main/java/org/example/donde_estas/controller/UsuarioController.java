package org.example.donde_estas.controller;

import org.example.donde_estas.dto.usuario.UsuarioDetalleDTO;
import org.example.donde_estas.dto.usuario.UsuarioNuevoDTO;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.service.AuthService;
import org.example.donde_estas.service.RolService;
import org.example.donde_estas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UsuarioController {
    @Autowired
    private UsuarioService userService;
    @Autowired
    private AuthService authService;
    @Autowired
    private RolService rolService;
    @PostMapping("/crear")
    public ResponseEntity<Usuario> create(@RequestBody UsuarioNuevoDTO user) {
        Usuario usuario = userService.persist(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @PutMapping(value = "/{id}")
    public Usuario update(@RequestBody Usuario user, @PathVariable("id") Long userId) {
        user.setId(userId);
        return userService.update(user);
    }
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UsuarioDetalleDTO get(@PathVariable("id") Long userId) {
        Usuario user = userService.findById(userId);
        System.out.println(user.toString());
        UsuarioDetalleDTO dto = new UsuarioDetalleDTO(user);
        System.out.println(dto.toString());
        return dto;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Usuario user = authService.getUserFromToken(token);
        
        System.out.println("Usuario solicitando lista: " + user.getEmail());
        System.out.println("Rol del usuario: " + user.getRolNuevo().getNombre());
        
        boolean hasPermission = rolService.hasPermission(user.getRolNuevo().getNombre(), "LISTAR_USUARIOS");
        
        System.out.println("Tiene permiso LISTAR_USUARIOS: " + hasPermission);
        
        if (!hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("No tienes permiso para listar usuarios. Tu rol es: " + user.getRolNuevo().getNombre());
        }
        
        List<Usuario> usuarios = userService.findAll();
        List<UsuarioDetalleDTO> usuariosDTO = usuarios.stream()
            .map(UsuarioDetalleDTO::new)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(usuariosDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long userId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Usuario user = authService.getUserFromToken(token);
        boolean hasPermission = rolService.hasPermission(user.getRolNuevo().getNombre(), "ELIMINAR_USUARIOS");
        
        if (!hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("No tienes permiso para eliminar usuarios.");
        }
        
        userService.delete(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/{id}/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable("id") Long userId) {
        // Endpoint temporal para promover usuarios a admin
        Usuario usuario = userService.findById(userId);
        usuario.setRolNuevo(rolService.findByNombre("ADMIN"));
        userService.update(usuario);
        return ResponseEntity.ok("Usuario promovido a ADMIN exitosamente");
    }

}