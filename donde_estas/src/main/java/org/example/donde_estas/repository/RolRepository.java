package org.example.donde_estas.repository;

import org.example.donde_estas.model.RolNuevo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<RolNuevo, Long>{
    public java.util.Optional<RolNuevo> findByNombre(String nombre);
}

