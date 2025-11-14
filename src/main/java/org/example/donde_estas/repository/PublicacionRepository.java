package org.example.donde_estas.repository;

import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    
    Optional<Publicacion> findByMascota(Mascota mascota);

    Optional<Publicacion> findById(Long id);

    Optional<Publicacion> findByMascota_Id(Long idMascota);
}
