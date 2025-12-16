package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.donde_estas.dto.publicacion.PublicacionDTO;
import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.*;
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

    public List<PublicacionDTO> findAll() {
        // cast into list of dtos
        return publicacionRepository.findAll().stream().map(p -> new PublicacionDTO(p)).toList();
    }
    public PublicacionDTO findById(Long id) {
        return new PublicacionDTO(publicacionRepository.findById(id).orElseThrow(EntityNotFoundException::new));
    }

    /*
        Permite persistir una publicacion, si se mandan ids de mascota o usuario,
        se buscan en la base de datos
        y se devuelven, sino se crean nuevos. xde (estuve 2 horas con esto lpm)
     */
    @Transactional
    public PublicacionDTO persist(PublicacionDTO dto) {
        Publicacion publicacionNueva = new Publicacion(dto);
        if (dto.getUbicacion() == null)
        {
            throw new EntityNotFoundException("La ubicacion es obligatoria");
        }
        if (dto.getUbicacion().getId() == null) {
            publicacionNueva.setUbicacion(dto.getUbicacion());
        }
        else {
            Ubicacion ubicacionPersistida = ubicacionService.findById(dto.getUbicacion().getId());
            publicacionNueva.setUbicacion(ubicacionPersistida);
        }
        if (dto.getMascota() == null)
        {
            throw new EntityNotFoundException("La mascota es obligatoria");
        }
        if (dto.getMascota().getId() == null) {
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
        if (dto.getFotos() != null) {
            List<Foto> fotos = dto.getFotos();
            fotos.forEach(f -> f.setPublicacion(publicacionNueva));
            publicacionNueva.setFotos(fotos);
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
