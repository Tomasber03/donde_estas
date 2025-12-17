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
      <div class="relative h-64 w-full">
        <img [src]="'/assets/images/' + publicacion.fotos[0].nombre" [alt]="publicacion.mascota.nombre" class="w-full h-full object-cover">
        <span class="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {{ publicacion.activo ? publicacion.estadoInicial : publicacion.estadoCierre }}
        </span>
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
            <span>{{ publicacion.fechaInicial }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PetCardComponent {
  @Input() publicacion!: Publicacion;
  constructor (private router: Router) {}
  onPetClick(publicacion: Publicacion): void {
    this.router.navigate(['/publicacion', publicacion.id]);}
}