package org.example.donde_estas.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.apache.coyote.Response;
import org.example.donde_estas.dto.publicacion.PublicacionDTO;
import org.example.donde_estas.dto.publicacion.PublicacionModificadaDTO;
import org.example.donde_estas.model.Publicacion;
import org.example.donde_estas.service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/publicacion")
public class PublicacionController {
    @Autowired
    private PublicacionService publicacionService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PublicacionDTO dto) {
        System.out.println("========== CREAR PUBLICACIÓN ==========");
        System.out.println("📦 Request Body recibido:");
        System.out.println("Descripción: " + dto.getDescripcion());
        System.out.println("Activo: " + dto.isActivo());
        System.out.println("Estado Inicial: " + dto.getEstadoInicial());
        System.out.println("Usuario ID: " + dto.getUsuarioId());
        
        System.out.println("\n🐕 Datos de Mascota:");
        if (dto.getMascotaDTO() != null) {
            System.out.println("  - ID: " + dto.getMascotaDTO().getId());
            System.out.println("  - Nombre: " + dto.getMascotaDTO().getNombre());
            System.out.println("  - Tipo: " + dto.getMascotaDTO().getTipo());
            System.out.println("  - Raza: " + dto.getMascotaDTO().getRaza());
            System.out.println("  - Color: " + dto.getMascotaDTO().getColor());
            System.out.println("  - Tamaño: " + dto.getMascotaDTO().getTamano());
        } else {
            System.out.println("  - MascotaDTO es NULL");
        }
        
        System.out.println("\n📍 Datos de Ubicación:");
        if (dto.getUbicacionDTO() != null) {
            System.out.println("  - Latitud: " + dto.getUbicacionDTO().getLatitud());
            System.out.println("  - Longitud: " + dto.getUbicacionDTO().getLongitud());
            System.out.println("  - Ciudad: " + dto.getUbicacionDTO().getCiudad());
            System.out.println("  - Barrio: " + dto.getUbicacionDTO().getBarrio());
        } else {
            System.out.println("  - UbicacionDTO es NULL");
        }
        System.out.println("=======================================\n");
        
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(publicacionService.persist(dto));
        } catch (Exception e) {
            System.err.println("❌ ERROR al crear publicación:");
            System.err.println("Mensaje: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicacionDTO> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(publicacionService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<PublicacionDTO>> list() {
        return ResponseEntity.ok().body(publicacionService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @Valid @RequestBody PublicacionModificadaDTO dto) {
        return ResponseEntity.status(HttpStatus.OK).body(publicacionService.update(dto));
    }

    // Acciones de negocio
    @PostMapping("/{id}/recuperado")
    public ResponseEntity<?> marcarRecuperado(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(publicacionService.recuperado(id));
    }

    @PostMapping("/{id}/adoptado")
    public ResponseEntity<?> marcarAdoptado(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(publicacionService.adoptado(id));
    }


    // Manejo de errores básico similar a otros controllers
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
        return new ResponseEntity<>("Entidad no encontrada", HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return new ResponseEntity<>("Datos de entrada inválidos", HttpStatus.BAD_REQUEST);
    }
}

