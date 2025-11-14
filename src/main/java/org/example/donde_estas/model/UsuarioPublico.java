package org.example.donde_estas.model;

public class UsuarioPublico implements Rol {
    @Override
    public boolean puedeCambiarRol() {
        return false;
    }

    @Override
    public boolean puedeEliminarUsuarios() {
        return false;
    }

    @Override
    public boolean puedeListarUsuarios() {
        return false;
    }

    @Override
    public boolean puedeEditarPublicacionesAjenas() {
        return false;
    }

    @Override
    public boolean puedeEliminarPublicacionesAjenas() {
        return false;
    }

    @Override
    public boolean puedeListarPublicacionesAjenas() {
        return true;
    }

    public RolPersistido getEnum() {
        return RolPersistido.USUARIOPUBLICO;

    }
}
