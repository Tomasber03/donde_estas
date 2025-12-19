package org.example.donde_estas.repository;

import org.example.donde_estas.model.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermisoRepository extends JpaRepository<Permiso, Long>{
    public Permiso findByNombre(String nombre);
    public boolean existsByNombre(String nombre);
    
}

