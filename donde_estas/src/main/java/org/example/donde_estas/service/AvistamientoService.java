package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.donde_estas.dto.avistamiento.AvistamientoDTO;
import org.example.donde_estas.dto.publicacion.PublicacionDTO;
import org.example.donde_estas.model.*;
import org.example.donde_estas.repository.AvistamientoRepository;
import org.example.donde_estas.repository.PublicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvistamientoService {
    @Autowired
    private AvistamientoRepository avistamientoRepo;
    @Autowired
    private EncryptService encryptService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private UbicacionService ubicacionService;
    @Autowired
    private PublicacionService publicacionService;
    @Autowired
    private PublicacionRepository publicacionRepository;
    @Transactional
    public Avistamiento persist(AvistamientoDTO dto) {
        Avistamiento avistamiento = new Avistamiento(dto);

        if (dto.getUsuarioId() == null) {
            throw new IllegalArgumentException("El avistamiento debe tener un usuario asociado");
        }
        Usuario usuario = usuarioService.findById(dto.getUsuarioId());
        avistamiento.setUsuario(usuario);


        if (dto.getPublicacionId() == null) {
            throw new IllegalArgumentException("El avistamiento debe pertenecer a una publicación");
        }

        Publicacion publicacion = publicacionRepository.findById(dto.getPublicacionId())
                .orElseThrow(() -> new EntityNotFoundException("Publicacion no encontrada con id: " + dto.getPublicacionId()));
        publicacion.setUsuario(usuarioService.findById(dto.getUsuarioId()));
        avistamiento.setPublicacion(publicacion);


        if (dto.getUbicacion() == null) {
            throw new IllegalArgumentException("El avistamiento debe tener una ubicación asociada");
        }

        if (dto.getUbicacion().getId() != null) {
            Ubicacion ubicacionExistente = ubicacionService.findById(dto.getUbicacion().getId());
            avistamiento.setUbicacion(ubicacionExistente);
        } else {
            avistamiento.setUbicacion(dto.getUbicacion());
        }
        if (dto.getFotos() != null) {
            List<Foto> fotos = dto.getFotos();
            fotos.forEach(f -> f.setAvistamiento(avistamiento));
            avistamiento.setFotos(fotos);
        }

        return avistamientoRepo.save(avistamiento);
    }

    public Avistamiento findById(Long id) {
        return avistamientoRepo.findById(id).orElse(null);
    }
    public List<Avistamiento> findAll() {
        return avistamientoRepo.findAll();
    }
}