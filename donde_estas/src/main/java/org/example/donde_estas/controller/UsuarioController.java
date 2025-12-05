package org.example.donde_estas.controller;

import org.example.donde_estas.dto.usuario.UsuarioNuevoDTO;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UsuarioController {
    @Autowired
    private UsuarioService userService;
    @PostMapping("/crear")
    public ResponseEntity<Usuario> create(@RequestBody UsuarioNuevoDTO user) {
        Usuario usuario = userService.persist(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
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