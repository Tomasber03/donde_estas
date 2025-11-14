package org.example.donde_estas.controller;

import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mascota")
public class MascotaController {
    @Autowired
    private MascotaService mascotaService;
    @PostMapping
    public Mascota create(@RequestBody Mascota user) {

        return mascotaService.persist(user);
    }

    @PutMapping(value = "/{id}")
    public Mascota update(@RequestBody Mascota user, @PathVariable("id") Long userId) {
        user.setId(userId);
        return mascotaService.update(user);
    }
    @GetMapping(value = "/{id}")
    public Mascota get(@PathVariable("id") Long userId) {
        return mascotaService.findById(userId);
    }
}