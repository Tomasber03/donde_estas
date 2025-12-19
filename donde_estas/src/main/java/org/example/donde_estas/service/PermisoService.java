package org.example.donde_estas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.donde_estas.model.Permiso;
import org.example.donde_estas.repository.PermisoRepository;

import java.util.List;
@Service
public class PermisoService {
    @Autowired
    private PermisoRepository permisoRepo;
    @Autowired 
    RolService rolService;

    public List<Permiso> findAllPermisosByRol(String nombre) {
        return rolService.findByNombre(nombre).getPermisos();
    }

}
