package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.donde_estas.model.Mascota;
import org.example.donde_estas.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MascotaService {
    @Autowired
    private MascotaRepository mascotaRepo;
    @Autowired
    private EncryptService encryptService;
    @Transactional
    public Mascota persist(Mascota mascota){

        return mascotaRepo.save(mascota);
    }
    public Mascota update(Mascota mascota) {
        Mascota mascotaPersistido = mascotaRepo.findById(mascota.getId()).orElseThrow(EntityNotFoundException::new);

        mascotaPersistido.setNombre(mascota.getNombre());
        mascotaPersistido.setTipo(mascota.getTipo());
        mascotaPersistido.setRaza(mascota.getRaza());
        mascotaPersistido.setTamano(mascota.getTamano());
        mascotaPersistido.setColor(mascota.getColor());
        mascotaPersistido.setSexo(mascota.getSexo());
        mascotaPersistido.getFotos().clear();
        mascotaPersistido.getFotos().addAll(mascota.getFotos());
        return mascotaRepo.save(mascotaPersistido);
    }

    public Mascota findById(Long id){
        return mascotaRepo.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public List<Mascota> findAll(){
        return mascotaRepo.findAll();
    }
    public List<Mascota> findByRaza(String raza){
        return  mascotaRepo.findByRaza(raza);

    }
    public List<Mascota> findByTipo(String tipo){
        return  mascotaRepo.findByTipo(tipo);
    }
    
    public List<Mascota> findByUsuarioId(Long usuarioId){
        return mascotaRepo.findByUsuarioId(usuarioId);
    }
}