package org.example.donde_estas.service.helper;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotBlank;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.repository.PublicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PublicacionHelperService {

    @Autowired
    private PublicacionRepository publicacionRepository;

    public void validarPublicacionDuplicada(Publicacion publicacion) {
        Optional<Publicacion> publi = publicacionRepository.findByMascota(publicacion.getMascota());
        if (publi.isPresent() && publi.get().isActivo()) {
            throw new EntityExistsException("La mascota ya tiene una publicacion activa");
        }
    }

    public void notExistsPublicacion(Long id) {
        Optional<Publicacion> publicacion = publicacionRepository.findById(id);
        if (publicacion.isEmpty()) {
            throw new EntityNotFoundException("La publicacion no existe");
        }
    }

    public Publicacion getPublicacionMascota(Long idMascota) {
        Publicacion publicacion = publicacionRepository.findByMascota_Id(idMascota)
                .orElseThrow(() -> new EntityNotFoundException("No existe una publicacion para la mascota con id: " + idMascota));
        if (publicacion.isActivo()) {
            return publicacion;
        } else {
            throw new IllegalStateException("La publicacion de la mascota con id: " + idMascota + " no esta activa");
        }
    }
}
