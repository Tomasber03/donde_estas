package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
@CrossOrigin
@RestController
@RequestMapping("/mascota")
public class MascotaController {
    @Autowired
    private MascotaService mascotaService;
    @PostMapping
    public ResponseEntity<Mascota> create(@Valid @RequestBody Mascota user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mascotaService.persist(user));
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Mascota> update(@Valid @RequestBody Mascota user, @PathVariable("id") Long userId) {
        user.setId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(mascotaService.update(user));
    }
    @GetMapping(value = "/{id}")
    public Mascota get(@PathVariable("id") Long userId) {
        return mascotaService.findById(userId);
    }


}