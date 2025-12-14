package org.example.donde_estas.controller;

import org.example.donde_estas.dto.avistamiento.AvistamientoDTO;
import org.example.donde_estas.model.Avistamiento;
import org.example.donde_estas.service.AvistamientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin
@RestController
@RequestMapping("/avistamiento")
public class AvistamientoController {
    @Autowired
    private AvistamientoService avistamientoService;
    @PostMapping
    public ResponseEntity<AvistamientoDTO> create(@RequestBody AvistamientoDTO dto) {
        AvistamientoDTO dtoPersistido = new AvistamientoDTO (avistamientoService.persist(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(dtoPersistido);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<AvistamientoDTO> get(@PathVariable("id") Long avistamientoId) {
        AvistamientoDTO dto = new AvistamientoDTO(avistamientoService.findById(avistamientoId));
        return ResponseEntity.ok().body(dto);
    }
}
