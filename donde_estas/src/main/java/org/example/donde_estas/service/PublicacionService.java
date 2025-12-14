package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.donde_estas.dto.publicacion.PublicacionDTO;
import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.model.Ubicacion;
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
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private MascotaService mascotaService;
    @Autowired
    private UbicacionService ubicacionService;

    public List<Publicacion> findAll() {
        return publicacionRepository.findAll();
    }
    public Publicacion findById(Long id) {
        return publicacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    /*
        Permite persistir una publicacion, si se mandan ids de mascota o usuario,
        se buscan en la base de datos
        y se devuelven, sino se crean nuevos. xde (estuve 2 horas con esto lpm)
     */
    @Transactional
    public PublicacionDTO persist(PublicacionDTO dto) {
        Publicacion publicacionNueva = new Publicacion(dto);
        if (dto.getUbicacion() == null || dto.getUbicacion().getId() == null) {
            publicacionNueva.setUbicacion(dto.getUbicacion());
        }
        else {
            Ubicacion ubicacionPersistida = ubicacionService.findById(dto.getUbicacion().getId());
            publicacionNueva.setUbicacion(ubicacionPersistida);
        }
        if (dto.getMascota() == null || dto.getMascota().getId() == null) {
            publicacionNueva.setMascota(dto.getMascota());
        }
        else
        {
            Mascota mascotaPersistida = mascotaService.findById(dto.getMascota().getId());
            publicacionNueva.setMascota(mascotaPersistida);
        }
        if (dto.getUsuarioId() == null) {
            throw new EntityNotFoundException("El id del usuario es obligatorio");
        }
        else {
            Usuario usuarioPersistido = usuarioService.findById(dto.getUsuarioId());
            publicacionNueva.setUsuario(usuarioPersistido);
        }
        publicacionHelperService.validarPublicacionDuplicada(publicacionNueva);
        return new PublicacionDTO(publicacionRepository.save(publicacionNueva));
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
