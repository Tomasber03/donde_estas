import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionService } from '../../services/PublicactionService.service'; // Ajusta tu path
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/UserService.service';
export interface Mascota {
  id: number;
  nombre: string;
  tipo: string; // Perro, Gato
  raza: string;
  color: string;
  tamano: string; // Grande, Mediano...
  edad: string; // Joven, Adulto...
  fotoUrl: string; // URL de la imagen
}

interface UsuarioContacto { id: number; nombre: string; apellido: string; email: string; telefono: string; barrio: string; ciudad: string; rolPersistido: string;}
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
}

@Component({
  selector: 'app-detalle-publicacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-publicacion.component.html',
})
export class DetallePublicacionComponent implements OnInit {
  publicacion: Publicacion | null = null;
  loading = true;
  usuarioContacto: UsuarioContacto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionService: PublicacionService,
    private userService: UserService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPublicacion(Number(id));
    }
  }

  cargarPublicacion(id: number) {
  this.loading = true; // Asegúrate de iniciar loading en true

  this.publicacionService.getPublicacion(id).subscribe({
    next: (data: any) => {
      console.log(data)
      this.publicacion = data;
      console.log(this.publicacion)
      
      // --- CORRECCIÓN: Llamamos al usuario SOLO cuando ya tenemos la publicación ---
      if (this.publicacion && this.publicacion.usuarioId) {
        this.userService.getUser(this.publicacion.usuarioId).subscribe({
          next: (userData: any) => {
            console.log(userData)
            this.usuarioContacto = userData;
            this.loading = false; // Terminamos de cargar todo aquí
            this.cdr.detectChanges();
            console.log(this.usuarioContacto)
          },
          error: (err) => {
            console.error('Error usuario', err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
         this.loading = false; // Si no hay usuarioId, terminamos carga
      
         this.cdr.detectChanges();
      }
      // ---------------------------------------------------------------------------
    },
    error: (err: any) => {
      console.error('Error al cargar publicación', err);
      this.loading = false;
      this.router.navigate(['/']); // Redirige al dashboard en caso de error
    }
  });

}


  volver() {
    this.location.back();
  }

  reportarAvistamiento() {
    if (this.publicacion) {
      this.router.navigate(['/avistamiento/nuevo', this.publicacion.id]);
    }
  }

  // Helper para el color del badge según estado
  getEstadoBadgeColor(estado: string): string {
    switch (estado) {
      case 'PERDIDO': return 'bg-red-600';
      case 'ENCONTRADO': return 'bg-green-600';
      default: return 'bg-blue-600';
    }
  }
}