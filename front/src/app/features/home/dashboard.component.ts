import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetCardComponent } from './pet-card.component';
import { Pet } from './pet.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/UserService.service';
import { Publicacion } from '../models.model';
import { PublicacionService } from '../../services/PublicactionService.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PetCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stringBusqueda: string = '';
  tipo: string = 'todos';
  selectedTab: string = 'Todos';
  publicaciones: Publicacion[] = [];
  countForTab = {PERDIDO_PROPIO: 0, PERDIDO_AJENO: 0, RECUPERADO: 0, ADOPTADO: 0};
  // Datos simulados basados en la imagen
  constructor (private cdr: ChangeDetectorRef, private router: Router, private userService: UserService, private publicacionService: PublicacionService) {}
  ngOnInit(): void {
    this.publicacionService.getPublicacions().subscribe({
      next: (data: any) => {
        this.publicaciones = data;
        
        // Reiniciar contadores por seguridad si se llegara a llamar más de una vez
        this.countForTab = { PERDIDO_PROPIO: 0, PERDIDO_AJENO: 0, RECUPERADO: 0, ADOPTADO: 0 };

        // Calcular contadores
        for (let pub of this.publicaciones) {
          if (pub.activo) {
             // Asegúrate que el estado venga exactamente como la clave (mayúsculas/guiones)
             // Si pub.estadoInicial es "PERDIDO_PROPIO", funcionará.
             const estadoKey = pub.estadoInicial as keyof typeof this.countForTab;
             if (this.countForTab[estadoKey] !== undefined) {
                 this.countForTab[estadoKey]++;
             }
          }
        }

        this.updateTabsArray(); 
        
        this.filterPets();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error publicaciones', err);
      }
    });
  }

  // Método auxiliar para refrescar la visualización de las pestañas
  updateTabsArray() {
    this.tabs = [
      { label: 'Todos', count: this.publicaciones.length },
      { label: 'Perdido Propio', count: this.countForTab.PERDIDO_PROPIO },
      { label: 'Perdido Ajeno', count: this.countForTab.PERDIDO_AJENO },
      { label: 'Recuperado', count: this.countForTab.RECUPERADO },
      { label: 'Adoptado', count: this.countForTab.ADOPTADO },
    ];
  }

  filterPets(): void{
    if (!this.stringBusqueda) {
      this.filteredPetsList = this.publicaciones;
    }
    const lowerSearch = this.stringBusqueda.toLowerCase();
    this.filteredPetsList = this.publicaciones.filter(publicacion =>
      (publicacion.mascota?.nombre?.toLowerCase() || '').startsWith(lowerSearch) ||
      (publicacion.mascota?.raza?.toLowerCase() || '').startsWith(lowerSearch) ||
      (publicacion.ubicacion?.ciudad?.toLowerCase() || '').startsWith(lowerSearch) || 
      (publicacion.ubicacion?.barrio?.toLowerCase() || '').startsWith(lowerSearch)  
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
      this.filteredPetsList = this.filteredPetsList.filter(publicacion => publicacion.mascota.tipo.toLowerCase() !== 'perro' && publicacion.mascota.tipo.toLowerCase() !== 'gato');
    }
    else
    {
      this.filteredPetsList = this.filteredPetsList.filter(publicacion => publicacion.mascota.tipo.toLowerCase() === this.tipo.toLowerCase());
    }
  }
  
 
  filteredPetsList: Publicacion[] = this.publicaciones;
  tabs = [
    { label: 'Todos', count: this.publicaciones.length},
    { label: 'Perdido Propio', count: this.countForTab.PERDIDO_PROPIO},
    { label: 'Perdido Ajeno', count: this.countForTab.PERDIDO_AJENO},
    { label: 'Recuperado', count: this.countForTab.RECUPERADO},
    { label: 'Adoptado', count: this.countForTab.ADOPTADO},
  ];
  onTabClick(selectedTab: any): void {
    this.selectedTab = selectedTab.label;
    this.filterPets();
  }

  filterByStatus(status: string): void {
  // 1. Si es 'Todos', no filtramos nada (dejar la lista como está)
  if (status === 'Todos') {
    return;
  }

  // 2. Normalizamos el status del TAB (ej: "Perdido Propio" -> "perdido propio")
  // Usamos replaceAll por si acaso hubiera más de un guion bajo
  const estadoBuscado = status.toLowerCase().replaceAll("_", " ").trim();

  this.filteredPetsList = this.filteredPetsList.filter(publicacion => {
    // 3. Determinar qué campo mirar
    const estadoActual = publicacion.activo 
        ? publicacion.estadoInicial 
        : publicacion.estadoCierre;

    // 4. Normalizamos el estado de la PUBLICACION (ej: "PERDIDO_PROPIO" -> "perdido propio")
    // Verificamos que no sea null/undefined para evitar errores
    if (!estadoActual) return false;

    const estadoNormalizado = estadoActual.toLowerCase().replaceAll("_", " ").trim();

    return estadoNormalizado === estadoBuscado;
  });
}
  
}