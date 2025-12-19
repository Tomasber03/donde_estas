import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EditableMapComponent, MapLocation } from './editable-map.component';

@Component({
  selector: 'app-avistamiento',
  standalone: true,
  imports: [CommonModule, FormsModule, EditableMapComponent],
  templateUrl: './avistamiento.component.html',
  styleUrls: ['./avistamiento.component.css']
})
export class AvistamientoComponent {
  comentario: string = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  selectedFileName: string = '';
  ubicacion: MapLocation | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
           this.selectedFile !== null && 
           this.ubicacion !== null;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      // Aquí implementarás el envío del formulario al backend
      console.log('Formulario enviado:', {
        comentario: this.comentario,
        foto: this.selectedFile,
        ubicacion: this.ubicacion
      });
      
      // TODO: Implementar servicio para enviar datos al backend
      alert('Avistamiento reportado exitosamente');
      this.resetForm();
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