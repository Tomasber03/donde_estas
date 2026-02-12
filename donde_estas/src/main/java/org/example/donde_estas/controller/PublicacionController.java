package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.apache.coyote.Response;
import org.example.donde_estas.dto.publicacion.PublicacionDTO;
import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.service.AuthService;
import org.example.donde_estas.service.PublicacionService;
import org.example.donde_estas.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/publicacion")
public class PublicacionController {
    @Autowired
    private PublicacionService publicacionService;
    @Autowired
    private AuthService authService;
    @Autowired
    private RolService rolService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PublicacionDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(publicacionService.persist(dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicacionDTO> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(publicacionService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<PublicacionDTO>> list() {
        return ResponseEntity.ok().body(publicacionService.findAll());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Usuario user = authService.getUserFromToken(token);
        boolean isOwner = user.getId() == publicacionService.findById(id).getUsuarioId();
        boolean hasPermission = rolService.hasPermission(user.getRolNuevo().getNombre(), "ELIMINAR_PUBLICACIONES");
        if (!isOwner && !hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para eliminar publicaciones.");
        }   
        publicacionService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @Valid @RequestBody PublicacionModificadaDTO dto, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Usuario user = authService.getUserFromToken(token);
        boolean isOwner = user.getId().equals(publicacionService.findById(id).getUsuarioId());
        boolean hasPermission = rolService.hasPermission(user.getRolNuevo().getNombre(), "EDITAR_PUBLICACIONES");
        
        if (!isOwner && !hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para editar esta publicación.");
        }
        
        // Si no se proporciona idMascota, obtenerlo de la publicación existente
        if (dto.getIdMascota() == null) {
            PublicacionDTO publicacion = publicacionService.findById(id);
            dto.setIdMascota(publicacion.getMascota().getId());
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(publicacionService.update(dto));
    }

    // Acciones de negocio
    @PostMapping("/{id}/recuperado")
    public ResponseEntity<?> marcarRecuperado(@PathVariable("id") Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Usuario user = authService.getUserFromToken(token);
        boolean isOwner = user.getId().equals(publicacionService.findById(id).getUsuarioId());
        
        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo el dueño puede marcar la publicación como recuperada.");
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(publicacionService.recuperado(id));
    }

    @PostMapping("/{id}/adoptado")
    public ResponseEntity<?> marcarAdoptado(@PathVariable("id") Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Usuario user = authService.getUserFromToken(token);
        boolean isOwner = user.getId().equals(publicacionService.findById(id).getUsuarioId());
        
        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo el dueño puede marcar la publicación como adoptada.");
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(publicacionService.adoptado(id));
    }


    // Manejo de errores básico similar a otros controllers
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
        return new ResponseEntity<>("Entidad no encontrada", HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return new ResponseEntity<>("Datos de entrada inválidos", HttpStatus.BAD_REQUEST);
    }
}

