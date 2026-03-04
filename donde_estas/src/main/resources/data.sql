INSERT INTO roles (nombre) VALUES ('USUARIO_PUBLICO');
INSERT INTO roles (nombre) VALUES ('ADMIN');
INSERT INTO permisos (nombre) VALUES ('ELIMINAR_PUBLICACIONES');
INSERT INTO permisos (nombre) VALUES ('EDITAR_PUBLICACIONES');
INSERT INTO permisos (nombre) VALUES ('CAMBIAR_ROLES');
INSERT INTO permisos (nombre ) VALUES ('LISTAR_USUARIOS');
INSERT INTO permisos (nombre) VALUES ('ELIMINAR_USUARIOS');
INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (2, 1);
INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (2, 2);
INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (2, 3);
INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (2, 4);
INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (2, 5);
INSERT INTO usuarios (nombre,apellido, email, clave,barrio,ciudad, puntos, rol_id, telefono) 
VALUES ('Admin', 'Admin', 'admin@ejemplo.com', '$2a$12$nZYgQhfOWVHcS/X2j.dOKOXQmtqXGOWRqmCOTXHhVVk977CrJCWZ6', 'La Loma', 'La Plata', 0, 2, '1234567890');

-- contraseña del admin es admin123

