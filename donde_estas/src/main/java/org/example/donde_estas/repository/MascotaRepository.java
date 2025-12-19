package org.example.donde_estas.repository;

import org.example.donde_estas.model.Enum.RolPersistido;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    List<Mascota> findByTipo(String tipo);
    List<Mascota> findByRaza (String raza);
    
    @Query("SELECT DISTINCT m FROM Mascota m JOIN Publicacion p ON p.mascota = m WHERE p.usuario.id = :usuarioId")
    List<Mascota> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
