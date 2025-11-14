package org.example.donde_estas.service;
import jakarta.transaction.Transactional;
import org.example.donde_estas.model.Medalla;
import org.example.donde_estas.repository.MedallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedallaService {
    @Autowired
    private MedallaRepository medallaRepo;
    @Autowired
    private EncryptService encryptService;
    @Transactional
    public Medalla persist(Medalla medalla){

        return medallaRepo.save(medalla);
    }

    public Medalla findById(Long id){
        return medallaRepo.findById(id).orElse(null);
    }

    public List<Medalla> findAll(){
        return medallaRepo.findAll();
    }
}
