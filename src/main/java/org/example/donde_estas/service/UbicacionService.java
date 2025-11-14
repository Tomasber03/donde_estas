package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.donde_estas.model.Ubicacion;
import org.example.donde_estas.repository.UbicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UbicacionService {
    @Autowired
    private UbicacionRepository ubicacionRepository;

    public Ubicacion findById(Long id) {
        return  ubicacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }
    @Transactional
    public Ubicacion persist(Ubicacion ubicacion) {
        return ubicacionRepository.save(ubicacion);
    }
    @Transactional
    public Ubicacion update(Ubicacion ubicacion) {
        Ubicacion ubicacionPersistido = ubicacionRepository.findById(ubicacion.getId()).orElseThrow(EntityNotFoundException::new);

        ubicacionPersistido.setLatitud(ubicacion.getLatitud());
        ubicacionPersistido.setLongitud(ubicacion.getLongitud());
        ubicacionPersistido.setBarrio(ubicacion.getBarrio());
        ubicacionPersistido.setCiudad(ubicacion.getCiudad());
        return ubicacionRepository.save(ubicacionPersistido);
    }

}
