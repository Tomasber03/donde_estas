package org.example.donde_estas.controller;

import org.example.donde_estas.model.Avistamiento;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.service.AvistamientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avistamiento")
public class AvistamientoController {
    @Autowired
    private AvistamientoService avistamientoService;
    @PostMapping
    public Avistamiento create(@RequestBody Avistamiento avistamiento) {

        return avistamientoService.persist(avistamiento);
    }

    @GetMapping(value = "/{id}")
    public Avistamiento get(@PathVariable("id") Long avistamientoId) {return avistamientoService.findById(avistamientoId);
    }
}
