import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from './pet.model';
import { Router } from '@angular/router';
import { Publicacion} from '../models.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div (click)="onPetClick(this.publicacion)" style="cursor: pointer;" class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      <div class="relative h-64 w-full group">
        <!-- Foto actual -->
        <img *ngIf="publicacion.mascota.fotos && publicacion.mascota.fotos.length > 0" 
             [src]="publicacion.mascota.fotos[fotoActualIndex].url" 
             [alt]="publicacion.mascota.nombre" 
             class="w-full h-full object-cover">
        
        <!-- Sin fotos -->
        <div *ngIf="!publicacion.mascota.fotos || publicacion.mascota.fotos.length === 0" 
             class="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <!-- Badge de estado -->
        <span class="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {{ publicacion.activo ? publicacion.estadoInicial.replaceAll("_", " ") : publicacion.estadoCierre.replaceAll("_", " ") }}
        </span>
        
        <!-- Controles del carrusel (solo si hay más de una foto) -->
        <div *ngIf="totalFotos > 1" class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <!-- Botón anterior -->
          <button (click)="anteriorFoto($event)" 
                  class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- Botón siguiente -->
          <button (click)="siguienteFoto($event)" 
                  class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Indicadores de fotos -->
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <span *ngFor="let foto of publicacion.mascota.fotos; let i = index"
                  [ngClass]="i === fotoActualIndex ? 'bg-white' : 'bg-white/50'"
                  class="w-1.5 h-1.5 rounded-full transition-all duration-200">
            </span>
          </div>
        </div>
        
        <!-- Contador de fotos (siempre visible si hay múltiples) -->
        <div *ngIf="totalFotos > 1" class="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
          {{ fotoActualIndex + 1 }}/{{ totalFotos }}
        </div>
      </div>

      <div class="p-5 flex flex-col gap-3 flex-grow">
        <div>
          <h3 class="text-xl font-bold text-gray-900">{{ publicacion.mascota.nombre }}</h3>
          <p class="text-gray-500 text-sm">{{ publicacion.mascota.tipo }} • {{ publicacion.mascota.raza }}</p>
        </div>

        <div class="space-y-2 text-sm text-gray-600 mt-auto">
          <div class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ publicacion.ubicacion.ciudad }}</span>
          </div>

          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ publicacion.fechaInicial | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PetCardComponent {
  @Input() publicacion!: Publicacion;
  fotoActualIndex = 0;
  
  constructor (private router: Router) {}
  
  get totalFotos(): number {
    return this.publicacion?.mascota?.fotos?.length || 0;
  }
  
  siguienteFoto(event: Event): void {
    event.stopPropagation();
    if (this.publicacion && this.publicacion.mascota.fotos) {
      this.fotoActualIndex = (this.fotoActualIndex + 1) % this.publicacion.mascota.fotos.length;
    }
  }
  
  anteriorFoto(event: Event): void {
    event.stopPropagation();
    if (this.publicacion && this.publicacion.mascota.fotos) {
      this.fotoActualIndex = (this.fotoActualIndex - 1 + this.publicacion.mascota.fotos.length) % this.publicacion.mascota.fotos.length;
    }
  }
  
  onPetClick(publicacion: Publicacion): void {
    this.router.navigate(['/publicacion', publicacion.id]);
  }
}