package org.example.donde_estas.repository;

import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {

    Optional<Publicacion> findByMascota(Mascota mascota);

    @Query("SELECT p FROM Publicacion p LEFT JOIN FETCH p.mascota m LEFT JOIN FETCH m.fotos WHERE p.id = :id")
    Optional<Publicacion> findByIdWithFotos(@Param("id") Long id);
    
    @Query("SELECT DISTINCT p FROM Publicacion p LEFT JOIN FETCH p.mascota m LEFT JOIN FETCH m.fotos")
    List<Publicacion> findAllWithFotos();

    Optional<Publicacion> findByMascota_Id(Long idMascota);
}
