import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionService } from '../../services/PublicactionService.service';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/UserService.service';
import { AuthService } from '../../services/auth.service';
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
  esPropia = false;
  
  // Carrusel de fotos
  fotoActualIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionService: PublicacionService,
    private userService: UserService,
    private authService: AuthService,
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
    this.loading = true;

    this.publicacionService.getPublicacion(id).subscribe({
      next: (data: any) => {
        this.publicacion = data;
        
        // Verificar si la publicación es del usuario actual
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && this.publicacion) {
          this.esPropia = this.publicacion.usuarioId === currentUser.userId;
        }
        
        if (this.publicacion && this.publicacion.usuarioId) {
          this.userService.getUser(this.publicacion.usuarioId).subscribe({
            next: (userData: any) => {
              this.usuarioContacto = userData;
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error usuario', err);
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error al cargar publicación', err);
        this.loading = false;
        this.router.navigate(['/']);
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
    if (!this.esPropia) {
      alert('No tienes permiso para editar esta publicación');
      return;
    }
    
    if (this.publicacion && this.publicacion.id) {
      this.router.navigate(['/editar-publicacion', this.publicacion.id]);
    }
  }

  editarMascota() {
    if (this.publicacion && this.publicacion.mascota && this.publicacion.mascota.id) {
      this.router.navigate(['/editar-mascota', this.publicacion.mascota.id]);
    }
  }
  
  marcarComoRecuperado() {
    if (!this.esPropia) {
      alert('No tienes permiso para modificar esta publicación');
      return;
    }
    
    if (!this.publicacion || !this.publicacion.id) {
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres marcar esta publicación como recuperada?')) {
      this.publicacionService.marcarRecuperado(this.publicacion.id).subscribe({
        next: () => {
          alert('¡Felicidades! La mascota ha sido marcada como recuperada');
          // Recargar la publicación para mostrar el estado actualizado
          if (this.publicacion && this.publicacion.id) {
            this.cargarPublicacion(this.publicacion.id);
          }
        },
        error: (err) => {
          console.error('Error al marcar como recuperado', err);
          alert('Error al marcar la publicación como recuperada');
        }
      });
    }
  }
  marcarComoAdoptado() {
    if (!this.esPropia) {
      alert('No tienes permiso para modificar esta publicación');
      return;
    }
    
    if (!this.publicacion || !this.publicacion.id) {
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres marcar esta publicación como adoptada?')) {
      this.publicacionService.marcarAdoptado(this.publicacion.id).subscribe({
        next: () => {
          alert('¡Felicidades! La mascota ha sido marcada como adoptada');
          // Recargar la publicación para mostrar el estado actualizado
          if (this.publicacion && this.publicacion.id) {
            this.cargarPublicacion(this.publicacion.id);
          }
        },
        error: (err) => {
          console.error('Error al marcar como adoptado', err);
          alert('Error al marcar la publicación como adoptada');
        }
      });
    }
  }
  eliminarPublicacion() {
    if (!this.esPropia) {
      alert('No tienes permiso para eliminar esta publicación');
      return;
    }
    
    if (!this.publicacion || !this.publicacion.id) {
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
      this.publicacionService.deletePublicacion(this.publicacion.id).subscribe({
        next: () => {
          alert('Publicación eliminada exitosamente');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error al eliminar la publicación', err);
          alert('Error al eliminar la publicación');
        }
      });
    }
  }

  // Helper para el color del badge según estado
  getEstadoBadgeColor(estado: string): string {
    switch (estado) {
      case 'PERDIDO_PROPIO': return 'bg-red-600';
      case 'PERDIDO_AJENO': return 'bg-orange-600';
      case 'RECUPERADO': return 'bg-green-600';
      case 'ADOPTADO': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  }
  
  // Métodos para el carrusel de fotos
  get totalFotos(): number {
    return this.publicacion?.mascota?.fotos?.length || 0;
  }
  
  siguienteFoto(): void {
    if (this.publicacion && this.publicacion.mascota.fotos) {
      this.fotoActualIndex = (this.fotoActualIndex + 1) % this.publicacion.mascota.fotos.length;
    }
  }
  
  anteriorFoto(): void {
    if (this.publicacion && this.publicacion.mascota.fotos) {
      this.fotoActualIndex = (this.fotoActualIndex - 1 + this.publicacion.mascota.fotos.length) % this.publicacion.mascota.fotos.length;
    }
  }
  
  irAFoto(index: number): void {
    this.fotoActualIndex = index;
  }
}