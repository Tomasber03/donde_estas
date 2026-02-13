import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapSelectorComponent, MapLocation } from '../../shared/map-selector/map-selector.component';
import { PublicacionService } from '../../services/PublicactionService.service';
import { AuthService } from '../../services/auth.service';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../models.model';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-publication',
  standalone: true,
  imports: [CommonModule, FormsModule, MapSelectorComponent],
  templateUrl: './create-publication.component.html',
})
export class CreatePublicationComponent implements OnInit {
  formData = {
    estaActivo: true,
    descripcion: '',
    estadoInicial: '',
    nombreMascota: '',
    especieMascota: '',
    razaMascota: '',
    colorMascota: '',
    tamanioMascota: '',
    sexoMascota: '',
    ciudad: '',
    barrio: '',
    latitud: '',
    longitud: ''
  };

  showMap = false;
  isSubmitting = false;
  
  usarMascotaExistente = false;
  mascotaSeleccionada: Mascota | null = null;
  mascotasDelUsuario: Mascota[] = [];
  fotosSeleccionadas: File[] = [];
  previewUrls: string[] = [];

  constructor(
    private router: Router,
    private publicacionService: PublicacionService,
    private authService: AuthService,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarMascotasDelUsuario();
  }

  cargarMascotasDelUsuario(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.userId) {
      this.mascotaService.getMascotasByUsuario(currentUser.userId).subscribe({
        next: (mascotas) => {
          this.mascotasDelUsuario = mascotas;
        },
        error: (error) => {
          console.error('Error al cargar mascotas:', error);
        }
      });
    }
  }

  onCheckboxChange(): void {
    if (!this.usarMascotaExistente) {
      this.mascotaSeleccionada = null;
      this.formData.nombreMascota = '';
      this.formData.especieMascota = '';
      this.formData.razaMascota = '';
      this.formData.colorMascota = '';
      this.formData.tamanioMascota = '';
    } else {
      this.fotosSeleccionadas = [];
      this.previewUrls = [];
    }
  }

  onMascotaSelected(event: any): void {
    const mascotaId = parseInt(event.target.value);
    this.mascotaSeleccionada = this.mascotasDelUsuario.find(m => m.id === mascotaId) || null;
    
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.fotosSeleccionadas.push(file);
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
    
  }

  removePhoto(index: number): void {
    this.fotosSeleccionadas.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onLocationSelected(location: MapLocation) {
    this.formData.latitud = location.lat.toString();
    this.formData.longitud = location.lng.toString();
    
    if (location.ciudad) {
      this.formData.ciudad = location.ciudad;
    }
    if (location.barrio) {
      this.formData.barrio = location.barrio;
    }
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  onSubmit() {
    if (this.isSubmitting) return;

    if (!this.formData.descripcion || !this.formData.estadoInicial) {
      alert('Por favor completa los campos obligatorios: Descripción y Tipo de reporte');
      return;
    }

    if (this.formData.estadoInicial === 'PERDIDO_PROPIO') {
      if (this.usarMascotaExistente) {
        if (!this.mascotaSeleccionada) {
          alert('Por favor selecciona una de tus mascotas de la lista');
          return;
        }
      } else {
        if (!this.formData.nombreMascota || this.formData.nombreMascota.trim() === '') {
          alert('El nombre de la mascota es obligatorio');
          return;
        }
        if (this.fotosSeleccionadas.length === 0) {
          alert('Debes subir al menos una foto de la mascota nueva');
          return;
        }
      }
    } else {
      if (!this.formData.nombreMascota || this.formData.nombreMascota.trim() === '') {
        alert('El nombre de la mascota es obligatorio');
        return;
      }
      if (this.fotosSeleccionadas.length === 0) {
        alert('Debes subir al menos una foto de la mascota');
        return;
      }
    }

    if (!this.formData.latitud || !this.formData.longitud) {
      alert('Por favor selecciona una ubicación en el mapa');
      return;
    }

    if (!this.formData.ciudad || this.formData.ciudad.trim() === '') {
      this.formData.ciudad = 'No especificada';
    }
    if (!this.formData.barrio || this.formData.barrio.trim() === '') {
      this.formData.barrio = 'No especificado';
    }

    const currentUser = this.authService.getCurrentUser();
    console.log('Current User:', currentUser);
    
    if (!currentUser || !currentUser.userId) {
      alert('Debes estar autenticado para crear una publicación');
      this.router.navigate(['/login']);
      return;
    }

    console.log('User ID:', currentUser.userId);
    this.isSubmitting = true;

    let mascotaDTO: any;
    
    if (this.usarMascotaExistente && this.mascotaSeleccionada) {
      mascotaDTO = {
        id: this.mascotaSeleccionada.id
      };
    } else {
      mascotaDTO = {
        nombre: this.formData.nombreMascota.trim(),
        raza: this.formData.razaMascota?.trim() || 'Sin especificar',
        color: this.formData.colorMascota?.trim() || 'Sin especificar',
        tamano: this.formData.tamanioMascota || 'Sin especificar',
        tipo: this.formData.especieMascota || 'Sin especificar',
        sexo: this.formData.sexoMascota || 'Sin especificar'      
};
    }

    const fotosPromises = this.fotosSeleccionadas.map((file, index) => {
      return new Promise<{nombre: string, url: string}>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve({
            nombre: file.name,
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fotosPromises).then(fotosBase64 => {
      const publicacionDTO = {
        descripcion: this.formData.descripcion.trim(),
        activo: true,
        estadoInicial: this.formData.estadoInicial,
        usuarioId: currentUser.userId,
        mascotaDTO: mascotaDTO,
        ubicacionDTO: {
          ciudad: this.formData.ciudad.trim(),
          barrio: this.formData.barrio.trim(),
          latitud: this.formData.latitud,
          longitud: this.formData.longitud
        },
        fotosDTO: fotosBase64
      };

      console.log('=== DATOS A ENVIAR ===');
      console.log('Usuario ID:', currentUser.userId);
      console.log('Publicación DTO:', JSON.stringify(publicacionDTO, null, 2));

      this.publicacionService.createPublicacion(publicacionDTO).subscribe({
        next: (response) => {
          console.log('✅ Publicación creada exitosamente:', response);
          this.isSubmitting = false;
          
          this.notificationService.showSuccess('¡Publicación creada exitosamente!');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('❌ Error completo:', error);
          console.error('Status:', error.status);
          console.error('Error response:', error.error);
          
          let errorMsg = 'Error al crear la publicación';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            } else if (error.error.error) {
              errorMsg = error.error.error;
            }
          } else if (error.message) {
            errorMsg = error.message;
          }
          
          alert(errorMsg);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }).catch(error => {
      console.error('Error al convertir imágenes:', error);
      alert('Error al procesar las imágenes');
      this.isSubmitting = false;
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
