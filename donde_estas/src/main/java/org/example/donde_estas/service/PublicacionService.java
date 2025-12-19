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
        Publicacion publicacionNueva = new Publicacion();
        publicacionNueva.setActivo(dto.isActivo());
        publicacionNueva.setEstadoInicial(dto.getEstadoInicial());
        publicacionNueva.setDescripcion(dto.getDescripcion());
        publicacionNueva.setFechaInicial(java.time.LocalDateTime.now());
        
        // Procesar Ubicacion
        if (dto.getUbicacionDTO() != null) {
            Ubicacion ubicacion = new Ubicacion();
            ubicacion.setCiudad(dto.getUbicacionDTO().getCiudad());
            ubicacion.setBarrio(dto.getUbicacionDTO().getBarrio());
            ubicacion.setLatitud(dto.getUbicacionDTO().getLatitud());
            ubicacion.setLongitud(dto.getUbicacionDTO().getLongitud());
            publicacionNueva.setUbicacion(ubicacion);
        } else if (dto.getUbicacion() != null) {
            if (dto.getUbicacion().getId() == null) {
                publicacionNueva.setUbicacion(dto.getUbicacion());
            } else {
                Ubicacion ubicacionPersistida = ubicacionService.findById(dto.getUbicacion().getId());
                publicacionNueva.setUbicacion(ubicacionPersistida);
            }
        } else {
            throw new EntityNotFoundException("La ubicacion es obligatoria");
        }
        
        // Procesar Mascota
        Mascota mascotaFinal;
        if (dto.getMascotaDTO() != null) {
            if (dto.getMascotaDTO().getId() != null) {
                // Usar mascota existente
                mascotaFinal = mascotaService.findById(dto.getMascotaDTO().getId());
            } else {
                // Crear nueva mascota con fotos
                Mascota nuevaMascota = new Mascota();
                nuevaMascota.setNombre(dto.getMascotaDTO().getNombre());
                nuevaMascota.setRaza(dto.getMascotaDTO().getRaza());
                nuevaMascota.setColor(dto.getMascotaDTO().getColor());
                nuevaMascota.setTamano(dto.getMascotaDTO().getTamano());
                nuevaMascota.setTipo(dto.getMascotaDTO().getTipo());
                
                // Agregar fotos a la mascota nueva
                if (dto.getFotosDTO() != null && !dto.getFotosDTO().isEmpty()) {
                    for (var fotoDTO : dto.getFotosDTO()) {
                        Foto foto = new Foto();
                        foto.setNombre(fotoDTO.getNombre());
                        foto.setUrl(fotoDTO.getUrl());
                        foto.setDescripcion(fotoDTO.getDescripcion());
                        foto.setFechaCreacion(java.time.LocalDateTime.now());
                        foto.setEsDePublicacion(false);
                        nuevaMascota.addFoto(foto);
                    }
                }
                mascotaFinal = nuevaMascota;
            }
        } else if (dto.getMascota() != null) {
            if (dto.getMascota().getId() == null) {
                mascotaFinal = dto.getMascota();
            } else {
                mascotaFinal = mascotaService.findById(dto.getMascota().getId());
            }
        } else {
            throw new EntityNotFoundException("La mascota es obligatoria");
        }
        
        publicacionNueva.setMascota(mascotaFinal);
        
        // Procesar Usuario
        if (dto.getUsuarioId() == null) {
            throw new EntityNotFoundException("El id del usuario es obligatorio");
        }
        Usuario usuarioPersistido = usuarioService.findById(dto.getUsuarioId());
        publicacionNueva.setUsuario(usuarioPersistido);
        
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
