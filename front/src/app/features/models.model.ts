export interface Mascota {
  id: number;
  nombre: string;
  tipo: string; // Perro, Gato
  raza: string;
  color: string;
  tamano: string; // Grande, Mediano...
  edad: string; // Joven, Adulto...
}
export interface Foto {
    id: number;
    nombre: string;
    fechaCreacion:string;
}
export interface UsuarioContacto { id: number; nombre: string; apellido: string; email: string; telefono: string; barrio: string; ciudad: string; puntos:number; rolPersistido: string;}
export interface Ubicacion {
    barrio: string;
    ciudad: string;
    latitud: string;
    longitud: string;
}
export interface Publicacion {
  id: number;
  activo: boolean;
  estadoInicial: string; // Ajusta a tus Enums
  estadoCierre: string;
  fechaInicial: string;
  fechaModificacion: string;
  descripcion: string;
  mascota: Mascota;
  ubicacion: Ubicacion;
  usuarioId: number; 
  fotos : Foto[];
}