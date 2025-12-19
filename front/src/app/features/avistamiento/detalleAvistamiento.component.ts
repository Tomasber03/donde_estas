import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../publicationDetail/map.component';

interface Avistamiento {
  id: number;
  fechaCreacion: string;
  comentario: string;
  usuarioId: number;
  publicacionId: number;
  ubicacion: {
    barrio: string;
    ciudad: string;
    latitud: string;
    longitud: string;
  };
  fotos: Array<{
    id: number;
    nombre: string;
    fechaCreacion: string;
  }>;
}

@Component({
  selector: 'app-detalle-avistamiento',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './detalleAvistamiento.component.html',
  styleUrls: ['./detalleAvistamiento.component.css']
})
export class DetalleAvistamientoComponent implements OnInit {
  avistamiento: Avistamiento | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido:', id);
    if (id) {
      this.cargarAvistamiento(Number(id));
    } else {
      this.router.navigate(['/home']);
    }
  }

  cargarAvistamiento(id: number): void {
    this.loading = true;
    console.log('Cargando avistamiento con ID:', id);
    
    // TODO: Implementar servicio para obtener el avistamiento del backend
    // Por ahora, datos de ejemplo:
    setTimeout(() => {
      console.log('Datos cargados');
      this.avistamiento = {
        id: id,
        fechaCreacion: '2025-12-18T10:30:00',
        comentario: 'Vi a esta mascota cerca del parque. Parecía estar asustada y buscaba algo. Tenía un collar rojo y respondía al nombre que le llamaban unos niños.',
        usuarioId: 1,
        publicacionId: 1,
        ubicacion: {
          barrio: 'Centro',
          ciudad: 'Montevideo',
          latitud: '-34.9011',
          longitud: '-56.1645'
        },
        fotos: [
          {
            id: 1,
            nombre: 'avistamiento1.jpg',
            fechaCreacion: '2025-12-18T10:30:00'
          }
        ]
      };
      this.loading = false;
      this.cdr.detectChanges();
      console.log('Estado actualizado:', { avistamiento: this.avistamiento, loading: this.loading });
    }, 500);

    /* Implementación real con el servicio:
    this.avistamientoService.getAvistamiento(id).subscribe({
      next: (data) => {
        this.avistamiento = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar avistamiento', err);
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
    */
  }

  volver(): void {
    this.location.back();
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  verPublicacion(): void {
    if (this.avistamiento) {
      this.router.navigate(['/publicacion', this.avistamiento.publicacionId]);
    }
  }
}