import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetCardComponent } from './pet-card.component';
import { Pet } from './pet.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/UserService.service';


interface User { id: number; nombre: string; apellido: string; clave: string; email: string; telefono: string; barrio: string; ciudad: string; rolPersistido: string;}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PetCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stringBusqueda: string = '';
  tipo: string = 'todos';
  selectedTab: string = 'Perdido Propio';
  user : User = { id: 0, nombre: '', apellido: '', clave: '', email: '', telefono: '', barrio: '', ciudad: '', rolPersistido: ''};
  // Datos simulados basados en la imagen
  userService = inject(UserService);
  ngOnInit(): void {
    this.userService.getUser(2).subscribe({next : (data) => { this.user = data; }});
    console.log(this.user)
    this.filterPets();
  }
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
    this.filterType();
    this.filterByStatus(this.selectedTab)
  }
  filterType(): void {
    if (this.tipo === 'todos') {
      return;
    } 
    else if (this.tipo === 'otro')
    {
      this.filteredPetsList = this.filteredPetsList.filter(pet => pet.type.toLowerCase() !== 'perro' && pet.type.toLowerCase() !== 'gato');
    }
    else
    {
      this.filteredPetsList = this.filteredPetsList.filter(pet => pet.type.toLowerCase() === this.tipo.toLowerCase());
    }
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
    ,
    {
      id: 4,
      name: 'Max',
      type: 'Gato',
      breed: 'Siames',
      location: 'Caballito, CABA',
      date: '25/9/2025',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800', // Foto de Gato Siames
      statusTag: 'Perdido Ajeno' 
    },
  ];
  filteredPetsList: Pet[] = this.pets;
  tabs = [
    { label: 'Perdido Propio', count: 3},
    { label: 'Perdido Ajeno', count: 1},
    { label: 'Recuperado', count: 0},
    { label: 'Adoptado', count: 0},
  ];
  onTabClick(selectedTab: any): void {
    this.selectedTab = selectedTab.label;
    this.filterPets();
  }

  filterByStatus(status: string): void {
    this.filteredPetsList = this.filteredPetsList.filter(pet => pet.statusTag === status);
  }
}