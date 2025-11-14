package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.example.donde_estas.model.Ubicacion;
import org.example.donde_estas.service.UbicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ubicacion")
public class UbicacionController {
    @Autowired
    private UbicacionService ubicacionService;
    @PostMapping
    public Ubicacion create(@Valid @RequestBody Ubicacion ubicacion) {
        return ubicacionService.persist(ubicacion);
    }

    @PutMapping(value = "/{id}")
    public Ubicacion update(@Valid @RequestBody Ubicacion ubicacion, @PathVariable("id") Long ubicacionId) {
        ubicacion.setId(ubicacionId);
        return ubicacionService.update(ubicacion);
    }
    @GetMapping(value = "/{id}")
    public Ubicacion get(@PathVariable("id") Long ubicacionId) {
        return ubicacionService.findById(ubicacionId);
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