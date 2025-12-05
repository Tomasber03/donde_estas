package org.example.donde_estas.controller;

import org.example.donde_estas.model.Medalla;
import org.example.donde_estas.service.MedallaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medal")
public class MedallaController {
    @Autowired
    private MedallaService medallaService;

    //despues vemos que mas le agregamos por ahora solo tengo traerlas
    @GetMapping(value = "/{id}")
    public Medalla get(@PathVariable("id") Long userId) {
        return medallaService.findById(userId);
    }
}
