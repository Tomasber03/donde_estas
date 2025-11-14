package org.example.donde_estas.service.helper;

import jakarta.persistence.EntityExistsException;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioHelperService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    public void validarUsuarioDuplicado(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new EntityExistsException("El usuario con email " + email + " ya existe");
        }
    }
}
