import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Avistamiento } from '../models.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div id="map"></div>
      <div class="map-legend" *ngIf="avistamientos && avistamientos.length > 0">
        <div class="legend-item">
          <span class="legend-marker publication"></span>
          <span>Ubicación de la publicación</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker sighting"></span>
          <span>Avistamientos ({{ avistamientos.length }})</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 300px; /* Altura del mapa */
      border-radius: 1rem; /* Rounded-2xl de tailwind */
      overflow: hidden;
      z-index: 1;
      position: relative;
    }
    #map {
      height: 100%;
      width: 100%;
    }
    .map-legend {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 1000;
      font-size: 12px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .legend-item:last-child {
      margin-bottom: 0;
    }
    .legend-marker {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
    .legend-marker.publication {
      background: #3b82f6;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    }
    .legend-marker.sighting {
      background: #10b981;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    }
  `]
})
export class MapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() lat!: string | number; // Aceptamos string o number
  @Input() lng!: string | number;
  @Input() avistamientos: Avistamiento[] = [];
  @Output() avistamientoClick = new EventEmitter<number>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes['avistamientos']) {
      this.updateMarkers();
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

    // Agregar marcador de la publicación con icono azul
    const blueIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([latNum, lngNum], { icon: blueIcon }).addTo(this.map)
      .bindPopup('<b>Ubicación de la publicación</b><br>Aquí se reportó la mascota')
      .openPopup();

    // Agregar marcadores de avistamientos
    this.addSightingMarkers();

    // Ajustar el zoom para mostrar todos los marcadores
    this.fitMapBounds();
  }

  private addSightingMarkers(): void {
    console.log('Agregando marcadores de avistamientos:', this.avistamientos);
    
    if (!this.map || !this.avistamientos || this.avistamientos.length === 0) {
      console.log('No hay avistamientos para mostrar');
      return;
    }

    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.avistamientos.forEach((avistamiento, index) => {
      console.log(`Procesando avistamiento ${index + 1}:`, avistamiento);
      
      if (avistamiento.ubicacion && avistamiento.ubicacion.latitud && avistamiento.ubicacion.longitud) {
        const lat = parseFloat(avistamiento.ubicacion.latitud);
        const lng = parseFloat(avistamiento.ubicacion.longitud);

        console.log(`Coordenadas del avistamiento ${index + 1}: lat=${lat}, lng=${lng}`);

        if (!isNaN(lat) && !isNaN(lng)) {
          const fecha = new Date(avistamiento.fechaCreacion).toLocaleDateString('es-ES');
          const popupContent = `
            <div style="cursor: pointer;">
              <b>Avistamiento #${index + 1}</b><br>
              <small>${fecha}</small><br>
              ${avistamiento.comentario ? avistamiento.comentario.substring(0, 100) + '...' : 'Sin comentario'}<br>
              <small style="color: #059669; font-weight: 600; margin-top: 4px; display: block;">Haz clic para ver detalles</small>
            </div>
          `;

          const marker = L.marker([lat, lng], { icon: greenIcon })
            .addTo(this.map!)
            .bindPopup(popupContent);
          
          // Agregar evento de clic al marcador
          marker.on('click', () => {
            if (avistamiento.id) {
              this.avistamientoClick.emit(avistamiento.id);
            }
          });
            
          console.log(`✓ Marcador agregado para avistamiento ${index + 1}`);
        } else {
          console.log(`✗ Coordenadas inválidas para avistamiento ${index + 1}`);
        }
      } else {
        console.log(`✗ Sin ubicación para avistamiento ${index + 1}`);
      }
    });
  }

  private updateMarkers(): void {
    // Limpiar marcadores existentes excepto el de la publicación
    // y volver a agregar los de avistamientos
    if (this.map) {
      this.addSightingMarkers();
      this.fitMapBounds();
    }
  }

  private fitMapBounds(): void {
    if (!this.map) return;

    const latNum = typeof this.lat === 'string' ? parseFloat(this.lat) : this.lat;
    const lngNum = typeof this.lng === 'string' ? parseFloat(this.lng) : this.lng;

    const bounds: L.LatLngBoundsExpression = [[latNum, lngNum]];

    // Agregar coordenadas de avistamientos
    this.avistamientos.forEach(avistamiento => {
      if (avistamiento.ubicacion && avistamiento.ubicacion.latitud && avistamiento.ubicacion.longitud) {
        const lat = parseFloat(avistamiento.ubicacion.latitud);
        const lng = parseFloat(avistamiento.ubicacion.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.push([lat, lng]);
        }
      }
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (bounds.length > 1) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
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