package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.donde_estas.dto.usuario.UsuarioNuevoDTO;
import org.example.donde_estas.model.Enum.RolPersistido;
import org.example.donde_estas.model.Rol;
import org.example.donde_estas.model.Usuario;
import org.example.donde_estas.model.UsuarioAdministrador;
import org.example.donde_estas.model.UsuarioPublico;
import org.example.donde_estas.repository.UsuarioRepository;
import org.example.donde_estas.service.helper.UsuarioHelperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepo;
    @Autowired
    private EncryptService encryptService;
    @Autowired
    private UsuarioHelperService UsuarioHelperService;

    @Transactional
    public Usuario persist(UsuarioNuevoDTO dto){
        Usuario user = new Usuario(dto);
        UsuarioHelperService.validarUsuarioDuplicado(user.getEmail());
        user.setClave(encryptService.encryptPassword(user.getClave()));
        // Asegurar rolPersistido válido para cumplir el CHECK de la BD
        if (user.getRolPersistido() == null) {
            user.setRolPersistido(RolPersistido.USUARIOPUBLICO);
        }
        usuarioRepo.save(user);
        return cargarRol(usuarioRepo.findById(user.getId()).orElseThrow(EntityNotFoundException::new));
    }
    public Usuario update(Usuario usuario) {
        Usuario usuarioPersistido = usuarioRepo.findById(usuario.getId()).orElse(null);
        if (usuarioPersistido == null)
            return null;

        usuarioPersistido.setNombre(usuario.getNombre());
        usuarioPersistido.setApellido(usuario.getApellido());
        usuarioPersistido.setEmail(usuario.getEmail());
        usuarioPersistido.setBarrio(usuario.getBarrio());
        usuarioPersistido.setCiudad(usuario.getCiudad());
        usuarioPersistido.setTelefono(usuario.getTelefono());

        usuarioRepo.save(usuarioPersistido);

        return cargarRol(usuario);
    }
    public Usuario updateRol(Long id, Rol rol)
    {
        Usuario usuarioPersistido = usuarioRepo.findById(id).orElse(null);
        if (usuarioPersistido == null)
            return null;
        usuarioPersistido.setRolPersistido(rol.getEnum());
        usuarioRepo.save(usuarioPersistido);
        return usuarioPersistido;
    }
    public Usuario addPuntos(Long id, int puntos)
    {
        Usuario usuarioPersistido = usuarioRepo.findById(id).orElse(null);
        if (usuarioPersistido == null)
            return null;
        usuarioPersistido.setPuntos(usuarioPersistido.getPuntos() + puntos);
        usuarioRepo.save(usuarioPersistido);
        return usuarioPersistido;
    }

    public Usuario findById(Long id){
        return cargarRol(usuarioRepo.findById(id).orElse(null));
    }

    public List<Usuario> findAll(){
        List<Usuario> usuarios = usuarioRepo.findAll();

        return cargarRoles(usuarios);
    }
    public Usuario findByEmail(String email){
        Usuario usuario = usuarioRepo.findByEmail(email).orElse(null);
        return cargarRol(usuario);
    }
    public Usuario findByEmailAndPass(String email, String pass){
        Usuario usuario = usuarioRepo.findByEmail(email).orElse(null);
        if (encryptService.verifyPassword(pass, usuario.getClave()))
            return cargarRol(usuario);
        else
            return null;
    }
    public List<Usuario> getByRol(RolPersistido rol) {
        List<Usuario> usuarios = usuarioRepo.getByRolPersistido(rol);
        return  cargarRoles(usuarios);
    }
    public List<Usuario> getByPuntosAsc() {
        List<Usuario> usuarios = usuarioRepo.findAllByOrderByPuntosAsc();
        return cargarRoles(usuarios);
    }

    private Usuario cargarRol(Usuario usuario) {
        if (usuario == null)
            return usuario;

        if (usuario.getRolPersistido() == RolPersistido.USUARIOPUBLICO)
        {
            usuario.setRol(new UsuarioPublico());
        }
        else{
            usuario.setRol(new UsuarioAdministrador());
        }
        return usuario;
    }
    private List<Usuario> cargarRoles(List<Usuario> usuarios) {
        for (Usuario u : usuarios) {
            cargarRol(u);
        }
        return usuarios;
    }
}