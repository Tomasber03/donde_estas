package org.example.donde_estas.service;

import jakarta.transaction.Transactional;
import org.example.donde_estas.model.Avistamiento;
import org.example.donde_estas.repository.AvistamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvistamientoService {
    @Autowired
    private AvistamientoRepository avistamientoRepo;
    @Autowired
    private EncryptService encryptService;
    @Transactional
    public Avistamiento persist(Avistamiento avistamiento){

        return avistamientoRepo.save(avistamiento);
    }

    public Avistamiento findById(Long id){
        return avistamientoRepo.findById(id).orElse(null);
    }
    public List<Avistamiento> findAll(){
        return avistamientoRepo.findAll();
    }
}
