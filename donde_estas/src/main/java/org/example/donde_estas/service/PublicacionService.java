package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.repository.PublicacionRepository;
import org.example.donde_estas.service.helper.PublicacionHelperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PublicacionService {
    @Autowired
    private PublicacionRepository publicacionRepository;
    @Autowired
    private PublicacionHelperService publicacionHelperService;

    public List<Publicacion> findAll() {
        return publicacionRepository.findAll();
    }
    public Publicacion findById(Long id) {
        return publicacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }
    @Transactional
    public Publicacion persist(Publicacion publicacion) {
        publicacionHelperService.validarPublicacionDuplicada(publicacion);
        return publicacionRepository.save(publicacion);
    }

    @Transactional
    public Publicacion recuperado(Long id) {
        publicacionHelperService.notExistsPublicacion(id);
        Publicacion publicacion = publicacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        publicacion.recuperado();
        return publicacionRepository.save(publicacion);
    }
    @Transactional
    public Publicacion update(PublicacionModificadaDTO publi){
        Publicacion publicacionPersist = publicacionHelperService.getPublicacionMascota(publi.getIdMascota());
        publicacionPersist.setDescripcion(publi.getDescripcion());
        return publicacionRepository.save(publicacionPersist);
    }
    @Transactional
    public Publicacion adoptado(Long id) {
        publicacionHelperService.notExistsPublicacion(id);
        Publicacion publicacion = publicacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        publicacion.adoptado();
        return publicacionRepository.save(publicacion);
    }
}
