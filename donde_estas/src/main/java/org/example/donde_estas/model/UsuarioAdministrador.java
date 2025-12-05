package org.example.donde_estas.model;

import org.example.donde_estas.model.Enum.RolPersistido;

public class UsuarioAdministrador implements Rol {
    @Override
    public boolean puedeCambiarRol() {
        return true;
    }

    @Override
    public boolean puedeEliminarUsuarios() {
        return true;
    }

    @Override
    public boolean puedeListarUsuarios() {
        return true;
    }

    @Override
    public boolean puedeEditarPublicacionesAjenas() {
        return true;
    }

    @Override
    public boolean puedeEliminarPublicacionesAjenas() {
        return true;
    }

    @Override
    public boolean puedeListarPublicacionesAjenas() {
        return true;
    }
    public RolPersistido getEnum() {
        return RolPersistido.ADMIN;

    }
}
