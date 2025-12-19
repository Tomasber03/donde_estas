export interface Mascota {
  id: number;
  nombre: string;
  tipo: string; // Perro, Gato
  raza: string;
  color: string;
  tamano: string; // Grande, Mediano...
  edad?: string; // Joven, Adulto...
  fotos?: Foto[]; // Fotos de la mascota
}

export interface Foto {
    id?: number;
    nombre: string;
    url?: string; // Base64 o URL
    descripcion?: string;
    fechaCreacion?: string;
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
  avistamientos: Avistamiento[];
}

export interface Avistamiento {
  id: number;
  fechaCreacion: string;
  comentario: string;
  usuarioId: number;
  publicacionId: number;
  ubicacion: Ubicacion;
  fotos: Foto[];
}