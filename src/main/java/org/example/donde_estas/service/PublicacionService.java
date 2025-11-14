package org.example.donde_estas.service;

import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.repository.PublicacionRepository;
import org.example.donde_estas.service.helper.PublicacionHelperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublicacionService {
    @Autowired
    private PublicacionRepository publicacionRepository;
    @Autowired
    private PublicacionHelperService publicacionHelperService;

    public Publicacion persist(Publicacion publicacion) {
        publicacionHelperService.validarPublicacionDuplicada(publicacion);
        return publicacionRepository.save(publicacion);
    }

    public Publicacion recuperado(Publicacion publicacion) {
        publicacionHelperService.notExistsPublicacion(publicacion.getId());
        publicacion.recuperado();
        return publicacionRepository.save(publicacion);
    }

    public Publicacion modificar(PublicacionModificadaDTO publi){
        Publicacion publicacionPersist = publicacionHelperService.getPublicacionMascota(publi.getIdMascota());
        publicacionPersist.setDescripcion(publi.getDescripcion());
        return publicacionRepository.save(publicacionPersist);
    }

    public Publicacion adoptado(Publicacion publicacion) {
        publicacionHelperService.notExistsPublicacion(publicacion.getId());
        publicacion.adoptado();
        return publicacionRepository.save(publicacion);
    }
}
