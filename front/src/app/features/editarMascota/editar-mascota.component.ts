import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';
import { Mascota, Foto } from '../models.model';

@Component({
  selector: 'app-editar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-mascota.component.html'
})
export class EditarMascotaComponent implements OnInit {
  mascota: Mascota | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  fotosNuevas: File[] = [];
  previewNuevas: string[] = [];
  fotosExistentes: Foto[] = [];
  fotosEliminadasIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.errorMessage = 'ID de mascota inválido';
      this.isLoading = false;
      return;
    }

    this.mascotaService.getMascota(id).subscribe({
      next: (data) => {
        this.mascota = { ...data };
        this.fotosExistentes = (data.fotos || []).map(f => ({ ...f }));
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Error al cargar mascota:', error);
        this.errorMessage = 'No se pudo cargar la información de la mascota';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.mascota || this.isSaving) {
      return;
    }

    if (!this.mascota.nombre || !this.mascota.tipo) {
      alert('Nombre y especie son obligatorios');
      return;
    }

    const fotosFinales: Foto[] = [];

    for (const foto of this.fotosExistentes) {
      if (!foto.id || !this.fotosEliminadasIds.includes(foto.id)) {
        fotosFinales.push({ ...foto });
      }
    }

    const convertirFotosNuevas = this.fotosNuevas.map((file) => {
      return new Promise<Foto>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve({
            nombre: file.name,
            url: e.target.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    this.isSaving = true;

    Promise.all(convertirFotosNuevas).then((fotosConvertidas) => {
      fotosFinales.push(...fotosConvertidas);

      const mascotaActualizada: Mascota = {
        ...this.mascota!,
        fotos: fotosFinales,
      };

      this.mascotaService.updateMascota(mascotaActualizada).subscribe({
        next: () => {
          alert('Mascota actualizada correctamente');
          this.isSaving = false;
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error al actualizar mascota:', error);
          this.errorMessage = 'Error al actualizar la mascota';
          this.isSaving = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  onNuevasFotosSelected(event: any): void {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.fotosNuevas.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewNuevas.push(e.target.result as string);
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  eliminarFotoExistente(index: number): void {
    const foto = this.fotosExistentes[index];
    if (foto.id) {
      this.fotosEliminadasIds.push(foto.id);
    }
    this.fotosExistentes.splice(index, 1);
  }

  eliminarFotoNueva(index: number): void {
    this.fotosNuevas.splice(index, 1);
    this.previewNuevas.splice(index, 1);
  }

  cancelar(): void {
    this.router.navigate(['/profile']);
  }
}
