import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionService } from '../../services/PublicactionService.service';
import { AuthService } from '../../services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-edit-publication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-publication.component.html'
})
export class EditPublicationComponent implements OnInit, AfterViewInit, OnDestroy {
  publicacionId: number | null = null;
  descripcion: string = '';
  loading = false;
  
  // Ubicación
  ubicacion = {
    ciudad: '',
    barrio: '',
    latitud: '',
    longitud: ''
  };
  
  // Mapa
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionService: PublicacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicacionId = Number(id);
      this.cargarPublicacion();
    }
  }
  
  ngAfterViewInit(): void {
    // El mapa se inicializará después de cargar la publicación
  }
  
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
  
  cargarPublicacion() {
    if (!this.publicacionId) return;

    this.publicacionService.getPublicacion(this.publicacionId).subscribe({
      next: (data: any) => {
        // Verificar que sea del usuario actual
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser || data.usuarioId !== currentUser.userId) {
          alert('No tienes permiso para editar esta publicación');
          this.router.navigate(['/publicacion', this.publicacionId]);
          return;
        }

        this.descripcion = data.descripcion;
        
        // Cargar ubicación
        if (data.ubicacion) {
          this.ubicacion = {
            ciudad: data.ubicacion.ciudad || '',
            barrio: data.ubicacion.barrio || '',
            latitud: data.ubicacion.latitud || '',
            longitud: data.ubicacion.longitud || ''
          };
        }
        
        // Inicializar mapa después de cargar datos
        setTimeout(() => {
          this.initMap();
        }, 100);
      },
      error: (err) => {
        console.error('Error al cargar publicación', err);
        alert('Error al cargar la publicación');
        this.router.navigate(['/home']);
      }
    });
  }
  
  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    const lat = parseFloat(this.ubicacion.latitud) || -34.6037;
    const lng = parseFloat(this.ubicacion.longitud) || -58.3816;

    this.map = L.map('map-edit').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Agregar marcador inicial
    this.marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(this.map);

    // Actualizar ubicación cuando se mueve el marcador
    this.marker.on('dragend', () => {
      if (this.marker) {
        const position = this.marker.getLatLng();
        this.updateLocation(position.lat, position.lng);
      }
    });

    // Actualizar ubicación cuando se hace clic en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateLocation(e.latlng.lat, e.latlng.lng);
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      }
    });
  }
  
  updateLocation(lat: number, lng: number): void {
    this.ubicacion.latitud = lat.toFixed(6);
    this.ubicacion.longitud = lng.toFixed(6);

    // Geocodificación inversa usando Nominatim
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        this.ubicacion.ciudad = data.address.city || data.address.town || data.address.village || '';
        this.ubicacion.barrio = data.address.suburb || data.address.neighbourhood || '';
      })
      .catch(err => console.error('Error en geocodificación:', err));
  }

  onSubmit() {
    if (!this.publicacionId) return;

    if (!this.descripcion || this.descripcion.trim() === '') {
      alert('La descripción es obligatoria');
      return;
    }
    
    if (!this.ubicacion.latitud || !this.ubicacion.longitud) {
      alert('Debes seleccionar una ubicación en el mapa');
      return;
    }

    this.loading = true;

    const updateDTO = {
      idMascota: null, // Se obtendrá del backend basado en el ID
      descripcion: this.descripcion.trim(),
      ubicacionDTO: {
        ciudad: this.ubicacion.ciudad,
        barrio: this.ubicacion.barrio,
        latitud: this.ubicacion.latitud,
        longitud: this.ubicacion.longitud
      }
    };

    this.publicacionService.updatePublicacion({
      id: this.publicacionId,
      ...updateDTO
    } as any).subscribe({
      next: () => {
        alert('Publicación actualizada exitosamente');
        this.router.navigate(['/publicacion', this.publicacionId]);
      },
      error: (err) => {
        console.error('Error al actualizar publicación', err);
        alert('Error al actualizar la publicación');
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/publicacion', this.publicacionId]);
  }
}
