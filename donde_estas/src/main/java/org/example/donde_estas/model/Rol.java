package org.example.donde_estas.model;


import org.example.donde_estas.model.Enum.RolPersistido;

public interface Rol {
    public boolean puedeCambiarRol();
    public boolean puedeEliminarUsuarios();
    public boolean puedeListarUsuarios();
    public boolean puedeEditarPublicacionesAjenas();
    public boolean puedeEliminarPublicacionesAjenas();
    public boolean puedeListarPublicacionesAjenas();
    public RolPersistido getEnum();

}
