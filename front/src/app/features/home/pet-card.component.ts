import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from './pet.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div (click)="onPetClick(this.pet)" style="cursor: pointer;" class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      <div class="relative h-64 w-full">
        <img [src]="pet.imageUrl" [alt]="pet.name" class="w-full h-full object-cover">
        <span class="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {{ pet.statusTag }}
        </span>
      </div>

      <div class="p-5 flex flex-col gap-3 flex-grow">
        <div>
          <h3 class="text-xl font-bold text-gray-900">{{ pet.name }}</h3>
          <p class="text-gray-500 text-sm">{{ pet.type }} • {{ pet.breed }}</p>
        </div>

        <div class="space-y-2 text-sm text-gray-600 mt-auto">
          <div class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ pet.location }}</span>
          </div>

          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ pet.date }}</span>
          </div>

          <div *ngIf="pet.reward" class="flex items-center gap-2 font-medium text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recompensa: {{ pet.reward }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PetCardComponent {
  @Input() pet!: Pet;
  constructor (private router: Router) {}
  onPetClick(pet: Pet): void {
    this.router.navigate(['/publicacion', pet.id]);}
}