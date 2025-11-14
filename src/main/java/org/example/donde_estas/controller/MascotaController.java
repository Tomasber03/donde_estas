package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mascota")
public class MascotaController {
    @Autowired
    private MascotaService mascotaService;
    @PostMapping
    public Mascota create(@Valid @RequestBody Mascota user) {
        return mascotaService.persist(user);
    }

    @PutMapping(value = "/{id}")
    public Mascota update(@Valid @RequestBody Mascota user, @PathVariable("id") Long userId) {
        user.setId(userId);
        return mascotaService.update(user);
    }
    @GetMapping(value = "/{id}")
    public Mascota get(@PathVariable("id") Long userId) {
        return mascotaService.findById(userId);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
        return new ResponseEntity<>("Entidad no encontrada", HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return new ResponseEntity<>("Datos de entrada inválidos", HttpStatus.BAD_REQUEST);
    }
}