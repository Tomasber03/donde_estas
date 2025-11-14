package org.example.donde_estas.controller;

import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UsuarioController {
    @Autowired
    private UsuarioService userService;
    @PostMapping
    public Usuario create(@RequestBody Usuario user) {

        return userService.persist(user);
    }

    @PutMapping(value = "/{id}")
    public Usuario update(@RequestBody Usuario user, @PathVariable("id") Long userId) {
        user.setId(userId);
        return userService.update(user);
    }
    @GetMapping(value = "/{id}")
    public Usuario get(@PathVariable("id") Long userId) {
        return userService.findById(userId);
    }
}