import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../models.model';
import { AuthService } from '../../services/auth.service';
import { PublicacionService } from '../../services/PublicactionService.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  mascotas: Mascota[] = [];
  currentIndex: number = 0;
  isLoading: boolean = false;
  itemsPorPagina: number = 3;
  mascotaPublicacionMap: Map<number, number> = new Map(); // mascotaId -> publicacionId

  constructor(
    private mascotaService: MascotaService,
    private authService: AuthService,
    private publicacionService: PublicacionService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMascotas();
  }

  get mascotasVisibles(): Mascota[] {
    const inicio = this.currentIndex * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.mascotas.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.mascotas.length / this.itemsPorPagina);
  }

  get puedeRetroceder(): boolean {
    return this.currentIndex > 0;
  }

  get puedeAvanzar(): boolean {
    return this.currentIndex < this.totalPaginas - 1;
  }

  cargarMascotas() {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.userId) {
      forkJoin({
        mascotas: this.mascotaService.getMascotasByUsuario(currentUser.userId),
        publicaciones: this.publicacionService.getPublicacions()
      }).subscribe({
        next: ({ mascotas, publicaciones }) => {
          this.mascotas = mascotas;
          
          // Crear mapa de mascotaId -> publicacionId
          publicaciones.forEach(pub => {
            if (pub.mascota && pub.mascota.id && pub.activo) {
              this.mascotaPublicacionMap.set(pub.mascota.id, pub.id);
            }
          });
          console.log('Mascotas cargadas:', this.mascotas);
          
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar mascotas:', error);
          this.mascotas = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoading = false;
      this.mascotas = [];
      this.cdr.detectChanges();
    }
  }

  siguiente() {
    if (this.puedeAvanzar) {
      this.currentIndex++;
    }
  }

  anterior() {
    if (this.puedeRetroceder) {
      this.currentIndex--;
    }
  }

  irAIndice(index: number) {
    this.currentIndex = index;
  }

  verDetalle(mascotaId: number | undefined) {
    if (mascotaId) {
      const publicacionId = this.mascotaPublicacionMap.get(mascotaId);
      if (publicacionId) {
        this.router.navigate(['/publicacion', publicacionId]);
      } else {
        console.warn('No se encontró publicación activa para la mascota:', mascotaId);
      }
    }
  }

  obtenerFoto(mascota: Mascota): string | undefined {
    if (mascota.fotos && mascota.fotos.length > 0) {
      return mascota.fotos[0].url;
    }
    return undefined;
  }
}
