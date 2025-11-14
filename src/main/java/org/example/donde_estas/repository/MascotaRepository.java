package org.example.donde_estas.repository;

import org.example.donde_estas.model.Enum.RolPersistido;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    List<Mascota> findByTipo(String tipo);
    List<Mascota> findByRaza (String raza);
}
