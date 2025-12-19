import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionService } from '../../services/PublicactionService.service'; // Ajusta tu path
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/UserService.service';
import { Publicacion, UsuarioContacto} from '../models.model';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-detalle-publicacion',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './detalle-publicacion.component.html',
})
export class DetallePublicacionComponent implements OnInit {
  publicacion: Publicacion | null = null;
  loading = true;
  usuarioContacto: UsuarioContacto | null = null;
  permisoEdicion = false;
  permisoEliminacion = false;

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
      console.log('Datos de la publicación:', data);
      this.publicacion = data;
      
      if (this.publicacion) {
        console.log('Avistamientos:', this.publicacion.avistamientos);
      }
      
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

  verAvistamiento(avistamientoId: number) {
    this.router.navigate(['/avistamiento', avistamientoId]);
  }

  reportarAvistamiento() {
    if (this.publicacion) {
      const queryParams: any = { 
        publicacionId: this.publicacion.id 
      };
      
      // Agregar coordenadas si la publicación tiene ubicación
      if (this.publicacion.ubicacion) {
        queryParams.lat = this.publicacion.ubicacion.latitud;
        queryParams.lng = this.publicacion.ubicacion.longitud;
      }
      
      this.router.navigate(['/avistamiento'], {
        queryParams: queryParams
      });
    }
  }

  editarPublicacion() {
  }
  eliminarPublicacion() {
    if (this.publicacion && this.publicacion.id) {
      this.publicacionService.deletePublicacion(this.publicacion.id).subscribe({
        next: () => {
          console.log('Publicación eliminada con éxito');
          this.router.navigate(['/home']);
        }
        ,
        error: (err) => {
          if (err.status === 403) {
            alert('No tienes permiso para eliminar esta publicación.');
            return;
          }
          console.error('Error al eliminar la publicación', err);
          alert('Ocurrió un error al eliminar la publicación.');
        }
      });
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