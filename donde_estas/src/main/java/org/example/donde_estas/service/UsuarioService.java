package org.example.donde_estas.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.donde_estas.dto.usuario.UsuarioNuevoDTO;
import org.example.donde_estas.model.Usuario;
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
    @Autowired
    private RolService rolService;

    @Transactional
    public Usuario persist(UsuarioNuevoDTO dto){
        Usuario user = new Usuario(dto);
        UsuarioHelperService.validarClaveDeOchoCaracteres(user.getClave());
        UsuarioHelperService.validarUsuarioDuplicado(user.getEmail());
        user.setClave(encryptService.encryptPassword(user.getClave()));
        user.setRolNuevo(rolService.findById(1L));

        return usuarioRepo.save(user);
    }
    public Usuario update(Usuario usuario) {
        Usuario usuarioPersistido = usuarioRepo.findById(usuario.getId()).orElseThrow(EntityNotFoundException::new);
        usuarioPersistido.setNombre(usuario.getNombre());
        usuarioPersistido.setApellido(usuario.getApellido());
        usuarioPersistido.setEmail(usuario.getEmail());
        usuarioPersistido.setBarrio(usuario.getBarrio());
        usuarioPersistido.setCiudad(usuario.getCiudad());
        usuarioPersistido.setTelefono(usuario.getTelefono());

        return usuarioRepo.save(usuarioPersistido);
    }

    public Usuario addPuntos(Long id, int puntos)
    {
        Usuario usuarioPersistido = usuarioRepo.findById(id).orElseThrow(EntityNotFoundException::new);
        if (usuarioPersistido == null)
            return null;
        usuarioPersistido.setPuntos(usuarioPersistido.getPuntos() + puntos);
        return usuarioRepo.save(usuarioPersistido);
    }

    public Usuario findById(Long id){
        return usuarioRepo.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public List<Usuario> findAll(){
        return usuarioRepo.findAll();
    }
    public Usuario findByEmail(String email){
        return usuarioRepo.findByEmail(email).orElseThrow(EntityNotFoundException::new);
    }
    public Usuario findByEmailAndPass(String email, String pass){
        Usuario usuario = usuarioRepo.findByEmail(email).orElseThrow(EntityNotFoundException::new);
        return encryptService.verifyPassword(pass, usuario.getClave()) ? usuario : null;
    }

    public List<Usuario> getByPuntosAsc() {
        return usuarioRepo.findAllByOrderByPuntosAsc();
    }

}