import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetCardComponent } from './pet-card.component';
import { Pet } from './pet.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PetCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  stringBusqueda: string = '';
  // Datos simulados basados en la imagen
  filterPets(): void{
    if (!this.stringBusqueda) {
      this.filteredPetsList = this.pets;
    }
    const lowerSearch = this.stringBusqueda.toLowerCase();
    this.filteredPetsList = this.pets.filter(pet =>
      pet.name.toLowerCase().startsWith(lowerSearch) ||
      pet.breed.toLowerCase().startsWith(lowerSearch) ||
      pet.location.toLowerCase().startsWith(lowerSearch)
    );
  }
  
  pets: Pet[] = [
    {
      id: 1,
      name: 'Max',
      type: 'Perro',
      breed: 'Labrador Retriever',
      location: 'Parque Las Heras, Palermo, CABA',
      date: '27/9/2025',
      reward: '$50.000',
      imageUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=800', // Foto de Golden/Labrador
      statusTag: 'Perdido Propio'
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Perro',
      breed: 'Caniche', // O similar según imagen (Corgi mix en la foto)
      location: 'Villa Urquiza, CABA',
      date: '30/9/2025',
      imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800', // Foto de Corgi
      statusTag: 'Perdido Propio'
    },
    {
      id: 3,
      name: 'Rocky',
      type: 'Perro',
      breed: 'Pastor Alemán', // O Husky según imagen
      location: 'Belgrano, CABA',
      date: '26/9/2025',
      reward: '$70.000',
      imageUrl: 'https://images.unsplash.com/photo-1563889958749-6bb433e7eb89?auto=format&fit=crop&q=80&w=800', // Foto de Husky
      statusTag: 'Perdido Propio'
    }
  ];
  filteredPetsList: Pet[] = this.pets;
  tabs = [
    { label: 'Perdido Propio', count: 3, active: true },
    { label: 'Perdido Ajeno', count: 1, active: false },
    { label: 'Recuperado', count: 1, active: false },
    { label: 'Adoptado', count: 1, active: false },
  ];
}