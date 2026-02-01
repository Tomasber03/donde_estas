package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.example.donde_estas.dto.publicacion.MascotaConFotosDTO;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/mascota")
public class MascotaController {
    @Autowired
    private MascotaService mascotaService;
    @PostMapping
    public ResponseEntity<Mascota> create(@Valid @RequestBody Mascota mascota) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mascotaService.persist(mascota));
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Mascota> update(@Valid @RequestBody Mascota pet, @PathVariable("id") Long petId) {
        pet.setId(petId);
        return ResponseEntity.status(HttpStatus.OK).body(mascotaService.update(pet));
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<MascotaConFotosDTO> get(@PathVariable("id") Long petId) {
        Mascota mascota = mascotaService.findById(petId);
        return ResponseEntity.ok(new MascotaConFotosDTO(mascota));
    }

    @GetMapping(value = "/usuario/{userId}")
    public ResponseEntity<List<MascotaConFotosDTO>> getMascotasByUsuario(@PathVariable("userId") Long userId) {
        List<Mascota> mascotas = mascotaService.findByUsuarioId(userId);
        List<MascotaConFotosDTO> mascotasDTO = mascotas.stream()
            .map(MascotaConFotosDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(mascotasDTO);
    }
}