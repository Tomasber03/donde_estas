import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface MapLocation {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-editable-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="editable-map-container">
      <div id="editable-map"></div>
      <div class="map-instructions" *ngIf="!selectedLocation">
        <p>📍 Haz clic en el mapa para marcar la ubicación del avistamiento</p>
      </div>
      <div class="map-coordinates" *ngIf="selectedLocation">
        <p>📍 Ubicación seleccionada: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}</p>
      </div>
    </div>
  `,
  styles: [`
    .editable-map-container {
      width: 100%;
      height: 400px;
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
      border: 2px solid #e5e7eb;
    }
    
    #editable-map {
      height: 100%;
      width: 100%;
      cursor: crosshair;
    }
    
    .map-instructions {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(59, 130, 246, 0.95);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .map-coordinates {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      color: #374151;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class EditableMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() initialLat: number = -34.9011; // Coordenadas por defecto (Buenos Aires, ejemplo)
  @Input() initialLng: number = -56.1645;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['initialLat'] || changes['initialLng'])) {
      this.map.setView([this.initialLat, this.initialLng], 13);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('editable-map', {
      center: [this.initialLat, this.initialLng],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // Listener para clics en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e.latlng);
    });
  }

  private onMapClick(latlng: L.LatLng): void {
    // Actualizar ubicación seleccionada
    this.selectedLocation = {
      lat: latlng.lat,
      lng: latlng.lng
    };

    // Remover marcador anterior si existe
    if (this.marker) {
      this.marker.remove();
    }

    // Agregar nuevo marcador
    this.marker = L.marker([latlng.lat, latlng.lng], {
      draggable: true
    }).addTo(this.map!);

    // Listener para cuando se arrastra el marcador
    this.marker.on('dragend', (e) => {
      const newPos = (e.target as L.Marker).getLatLng();
      this.selectedLocation = {
        lat: newPos.lat,
        lng: newPos.lng
      };
      this.locationSelected.emit(this.selectedLocation);
    });

    // Emitir evento con la ubicación seleccionada
    this.locationSelected.emit(this.selectedLocation);
  }

  // Método público para establecer ubicación programáticamente
  public setLocation(lat: number, lng: number): void {
    if (this.map) {
      this.map.setView([lat, lng], 15);
      this.onMapClick(L.latLng(lat, lng));
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
