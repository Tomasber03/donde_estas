import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../publicationDetail/map.component';
import { AvistamientoService } from '../../services/avistamiento.service';
import { Avistamiento } from '../models.model';

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
    private cdr: ChangeDetectorRef,
    private avistamientoService: AvistamientoService
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
    
    this.avistamientoService.getAvistamiento(id).subscribe({
      next: (data) => {
        console.log('Avistamiento recibido:', data);
        this.avistamiento = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar avistamiento', err);
        alert('No se pudo cargar el avistamiento');
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
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