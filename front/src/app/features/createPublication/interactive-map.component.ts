import { Component, Output, EventEmitter, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface MapLocation {
  lat: number;
  lng: number;
  ciudad?: string;
  barrio?: string;
}

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <div class="map-container">
        <div id="interactive-map"></div>
      </div>
      <p class="text-sm text-gray-600 text-center">
        Haz clic en el mapa para seleccionar la ubicación
      </p>
      <div *ngIf="selectedLocation" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p class="text-sm text-blue-800">
          <strong>Ubicación seleccionada:</strong><br>
          Lat: {{ selectedLocation.lat.toFixed(6) }}, Lng: {{ selectedLocation.lng.toFixed(6) }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 400px;
      border-radius: 0.5rem;
      overflow: hidden;
      border: 2px solid #e5e7eb;
      cursor: crosshair;
    }
    #interactive-map {
      height: 100%;
      width: 100%;
    }
  `]
})
export class InteractiveMapComponent implements AfterViewInit, OnDestroy {
  @Input() initialLat: number = -34.9215; // La Plata, Argentina por defecto
  @Input() initialLng: number = -57.9545;
  @Output() locationSelected = new EventEmitter<MapLocation>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  selectedLocation: MapLocation | null = null;

  constructor() {
    this.fixLeafletIcons();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('interactive-map', {
      center: [this.initialLat, this.initialLng],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // Agregar evento de click en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e);
    });
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;

    // Remover marcador anterior si existe
    if (this.marker) {
      this.marker.remove();
    }

    // Crear nuevo marcador
    this.marker = L.marker([lat, lng]).addTo(this.map!)
      .bindPopup('Ubicación seleccionada')
      .openPopup();

    // Guardar ubicación seleccionada
    this.selectedLocation = { lat, lng };

    // Hacer geocoding inverso para obtener ciudad y barrio
    this.reverseGeocode(lat, lng);

    // Emitir evento con la ubicación
    this.locationSelected.emit(this.selectedLocation);
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        const ciudad = data.address.city || data.address.town || data.address.village || data.address.state || 'Desconocida';
        const barrio = data.address.suburb || data.address.neighbourhood || data.address.road || 'Desconocido';
        
        this.selectedLocation = {
          lat,
          lng,
          ciudad,
          barrio
        };
        
        this.locationSelected.emit(this.selectedLocation);
      }
    } catch (error) {
      console.error('Error en geocoding inverso:', error);
    }
  }

  private fixLeafletIcons() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
}
