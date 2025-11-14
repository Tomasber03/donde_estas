package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publicacion")
public class PublicacionController {
    @Autowired
    private PublicacionService publicacionService;

    @PostMapping
    public Publicacion create(@Valid @RequestBody Publicacion publicacion) {
        return publicacionService.persist(publicacion);
    }

    @GetMapping("/{id}")
    public Publicacion get(@PathVariable("id") Long id) {
        return publicacionService.findById(id);
    }

    @GetMapping
    public List<Publicacion> list() {
        return publicacionService.findAll();
    }

    @PutMapping("/{id}")
    public Publicacion update(@PathVariable("id") Long id, @Valid @RequestBody PublicacionModificadaDTO dto) {
        return publicacionService.update(dto);
    }

    // Acciones de negocio
    @PostMapping("/{id}/recuperado")
    public Publicacion marcarRecuperado(@PathVariable("id") Long id) {
        return publicacionService.recuperado(id);
    }

    @PostMapping("/{id}/adoptado")
    public Publicacion marcarAdoptado(@PathVariable("id") Long id) {
        return publicacionService.adoptado(id);
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

