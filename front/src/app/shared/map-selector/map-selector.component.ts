import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface MapLocation {
  lat: number;
  lng: number;
  ciudad?: string;
  barrio?: string;
}

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-selector-wrapper">
      <div class="map-selector-container" [style.height.px]="height">
        <div [id]="mapId"></div>
        <div class="map-instructions" *ngIf="showInstructions && !selectedLocation">
          <p>📍 {{ instructionText }}</p>
        </div>
        <div class="map-coordinates" *ngIf="selectedLocation && showCoordinates">
          <p>📍 Ubicación: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}</p>
          <p *ngIf="selectedLocation.ciudad" class="location-details">
            {{ selectedLocation.barrio }}, {{ selectedLocation.ciudad }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-selector-wrapper {
      width: 100%;
    }
    
    .map-selector-container {
      width: 100%;
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
      border: 2px solid #e5e7eb;
    }
    
    .map-selector-container > div:first-child {
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
      max-width: 90%;
      text-align: center;
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
      max-width: 90%;
      text-align: center;
    }
    
    .map-coordinates p {
      margin: 0;
      line-height: 1.4;
    }
    
    .location-details {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem !important;
    }
  `]
})
export class MapSelectorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() initialLat: number = -34.9215; // La Plata, Argentina por defecto
  @Input() initialLng: number = -57.9545;
  @Input() height: number = 400;
  @Input() enableGeocoding: boolean = false;
  @Input() showInstructions: boolean = true;
  @Input() showCoordinates: boolean = true;
  @Input() instructionText: string = 'Haz clic en el mapa para seleccionar la ubicación';
  @Input() draggable: boolean = true;
  @Output() locationSelected = new EventEmitter<MapLocation>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  selectedLocation: MapLocation | null = null;
  mapId: string;

  constructor() {
    this.mapId = `map-selector-${Math.random().toString(36).substr(2, 9)}`;
    this.fixLeafletIcons();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
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
    this.map = L.map(this.mapId, {
      center: [this.initialLat, this.initialLng],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e.latlng);
    });
  }

  private onMapClick(latlng: L.LatLng): void {
    const { lat, lng } = latlng;

    this.selectedLocation = {
      lat,
      lng
    };

    if (this.marker) {
      this.marker.remove();
    }

    this.marker = L.marker([lat, lng], {
      draggable: this.draggable
    }).addTo(this.map!);

    if (this.draggable) {
      this.marker.on('dragend', (e) => {
        const newPos = (e.target as L.Marker).getLatLng();
        this.updateLocation(newPos.lat, newPos.lng);
      });
    }


    this.updateLocation(lat, lng);
  }

  private async updateLocation(lat: number, lng: number): Promise<void> {
    this.selectedLocation = { lat, lng };

    if (this.enableGeocoding) {
      await this.reverseGeocode(lat, lng);
    } else {
      this.locationSelected.emit(this.selectedLocation);
    }
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
      }
    } catch (error) {
      console.error('Error en geocoding inverso:', error);
    } finally {
      this.locationSelected.emit(this.selectedLocation!);
    }
  }

  public setLocation(lat: number, lng: number): void {
    if (this.map) {
      this.map.setView([lat, lng], 15);
      this.onMapClick(L.latLng(lat, lng));
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
