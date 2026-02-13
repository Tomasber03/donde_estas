import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapSelectorComponent, MapLocation } from '../../shared/map-selector/map-selector.component';
import { AvistamientoService } from '../../services/avistamiento.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-avistamiento',
  standalone: true,
  imports: [CommonModule, FormsModule, MapSelectorComponent],
  templateUrl: './avistamiento.component.html',
  styleUrls: ['./avistamiento.component.css']
})
export class AvistamientoComponent implements OnInit {
  comentario: string = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  selectedFileName: string = '';
  ubicacion: MapLocation | null = null;
  publicacionId: number | null = null;
  isSubmitting: boolean = false;
  
  // Coordenadas para centrar el mapa
  mapLat: number = -34.9011; // Coordenadas por defecto
  mapLng: number = -56.1645;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private avistamientoService: AvistamientoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la publicación y las coordenadas desde los query params
    this.route.queryParams.subscribe(params => {
      if (params['publicacionId']) {
        this.publicacionId = Number(params['publicacionId']);
        console.log('ID de publicación recibido:', this.publicacionId);
      }
      
      // Si vienen coordenadas, usarlas para centrar el mapa
      if (params['lat'] && params['lng']) {
        this.mapLat = Number(params['lat']);
        this.mapLng = Number(params['lng']);
        console.log('Coordenadas de la publicación:', this.mapLat, this.mapLng);
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.photoPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onLocationSelected(location: MapLocation): void {
    this.ubicacion = location;
    console.log('Ubicación seleccionada:', location);
    this.cdr.detectChanges();
  }

  removePhoto(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    this.photoPreview = null;
    this.selectedFileName = '';
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return this.comentario.trim().length > 0 && 
           this.ubicacion !== null;
  }

  onSubmit(): void {
    if (this.isFormValid() && !this.isSubmitting) {
      this.isSubmitting = true;

      const userId = this.authService.getCurrentUserId();
      
      if (!userId) {
        alert('Debes iniciar sesión para reportar un avistamiento');
        this.router.navigate(['/login']);
        this.isSubmitting = false;
        return;
      }

      if (!this.publicacionId) {
        alert('Error: No se encontró la publicación');
        this.isSubmitting = false;
        return;
      }

      // Preparar los datos para enviar
      const avistamientoData = {
        comentario: this.comentario,
        usuarioId: userId,
        publicacionId: this.publicacionId,
        ubicacion: {
          ciudad: 'Ciudad',  // TODO: Obtener de algún servicio de geolocalización
          barrio: 'Barrio',  // TODO: Obtener de algún servicio de geolocalización
          latitud: this.ubicacion!.lat.toString(),
          longitud: this.ubicacion!.lng.toString()
        },
        fotos: this.photoPreview ? [{
          nombre: this.selectedFileName || 'avistamiento.jpg',
          url: this.photoPreview,
          descripcion: 'Foto del avistamiento'
        }] : []
      };

      console.log('Enviando avistamiento:', avistamientoData);

      this.avistamientoService.createAvistamiento(avistamientoData).subscribe({
        next: (response) => {
          console.log('Avistamiento creado exitosamente:', response);
          alert('Avistamiento reportado exitosamente');
          
          // Redirigir a la publicación
          if (this.publicacionId) {
            this.router.navigate(['/publicacion', this.publicacionId]);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Error al crear avistamiento:', error);
          alert('Error al reportar el avistamiento. Por favor, intenta nuevamente.');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
      this.resetForm();
      this.router.navigate(['/home']);
    }
  }

  private resetForm(): void {
    this.comentario = '';
    this.selectedFile = null;
    this.photoPreview = null;
    this.selectedFileName = '';
    this.ubicacion = null;
    this.cdr.detectChanges();
  }
}