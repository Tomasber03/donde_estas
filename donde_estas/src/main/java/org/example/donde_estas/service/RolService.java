package org.example.donde_estas.service;

import javax.swing.text.html.parser.Entity;

import org.example.donde_estas.model.RolNuevo;
import org.example.donde_estas.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RolService {
    @Autowired
    private RolRepository rolRepo;
    public RolNuevo findById(Long id){
        return rolRepo.findById(id).orElseThrow(EntityNotFoundException::new);
    }
    public RolNuevo persist(RolNuevo rol){
        return rolRepo.save(rol);
    }
    public RolNuevo findByNombre(String nombre){
        return rolRepo.findByNombre(nombre).orElseThrow(EntityNotFoundException::new);
    }
    public boolean hasPermission(String rolNombre, String permisoNombre){
        RolNuevo rol = findByNombre(rolNombre);
        return rol.getPermisos().stream().anyMatch(permiso -> permiso.getNombre().equals(permisoNombre));
    }
}
