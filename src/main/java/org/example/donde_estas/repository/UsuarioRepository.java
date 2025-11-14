package org.example.donde_estas.repository;

import org.example.donde_estas.model.Enum.RolPersistido;
import org.example.donde_estas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> getByRolPersistido(RolPersistido rol);

    List<Usuario> findAllByOrderByPuntosAsc();

    boolean existsByEmail(String email);
}
