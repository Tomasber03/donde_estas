import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div id="map"></div>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 300px; /* Altura del mapa */
      border-radius: 1rem; /* Rounded-2xl de tailwind */
      overflow: hidden;
      z-index: 1;
    }
    #map {
      height: 100%;
      width: 100%;
    }
  `]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() lat!: string | number; // Aceptamos string o number
  @Input() lng!: string | number;

  private map: L.Map | undefined;

  constructor() {
    this.fixLeafletIcons();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    // Es buena práctica destruir el mapa al salir para liberar memoria
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Convertir a número por seguridad (tu modelo los tiene como string)
    const latNum = typeof this.lat === 'string' ? parseFloat(this.lat) : this.lat;
    const lngNum = typeof this.lng === 'string' ? parseFloat(this.lng) : this.lng;

    // Verificar que las coordenadas sean válidas
    if (isNaN(latNum) || isNaN(lngNum)) {
      console.error('Coordenadas inválidas para el mapa');
      return;
    }

    this.map = L.map('map', {
      center: [latNum, lngNum],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // Agregar marcador
    L.marker([latNum, lngNum]).addTo(this.map)
      .bindPopup('Ubicación aproximada')
      .openPopup();
  }

  // Solución para que aparezcan los iconos correctamente en Angular
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