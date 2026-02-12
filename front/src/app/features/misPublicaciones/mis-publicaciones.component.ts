import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PublicacionService } from '../../services/PublicactionService.service';
import { Publicacion } from '../models.model';
import { PetCardComponent } from '../home/pet-card.component';

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [CommonModule, PetCardComponent],
  templateUrl: './mis-publicaciones.component.html',
})
export class MisPublicacionesComponent implements OnInit {
  misPublicaciones: Publicacion[] = [];
  publicacionesActivas: Publicacion[] = [];
  publicacionesCerradas: Publicacion[] = [];
  tabActiva: string = 'activas';
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private publicacionService: PublicacionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMisPublicaciones();
  }

  loadMisPublicaciones() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.publicacionService.getPublicacions().subscribe({
      next: (data: Publicacion[]) => {
        // Filtrar solo las publicaciones del usuario actual
        this.misPublicaciones = data.filter(pub => pub.usuarioId === currentUser.userId);
        
        // Separar en activas y cerradas
        this.publicacionesActivas = this.misPublicaciones.filter(pub => pub.activo);
        this.publicacionesCerradas = this.misPublicaciones.filter(pub => !pub.activo);
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar publicaciones', err);
        this.isLoading = false;
      }
    });
  }

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  get publicacionesMostradas(): Publicacion[] {
    return this.tabActiva === 'activas' ? this.publicacionesActivas : this.publicacionesCerradas;
  }
}
