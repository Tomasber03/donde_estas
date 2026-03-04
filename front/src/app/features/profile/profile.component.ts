import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/UserService.service';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CarouselComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Partial<User> = {};

  editingUser: Partial<User> = { ...this.user };

  showModal: boolean = false;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  tempPreviewImage: string | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.userId) {
      this.userService.getUser(currentUser.userId).subscribe({
        next: (userData: User) => {
          this.user = {
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            telefono: userData.telefono,
            ciudad: userData.ciudad,
            barrio: userData.barrio
          };
          this.previewImage = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
          this.errorMessage = 'Error al cargar los datos del perfil';
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  openEditModal() {
    this.editingUser = { ...this.user };
    this.tempPreviewImage = this.previewImage;
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeModal() {
    this.showModal = false;
    this.selectedFile = null;
    this.tempPreviewImage = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempPreviewImage = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  saveProfile() {
  const currentUser = this.authService.getCurrentUser();
  if (!currentUser || !currentUser.userId) {
    this.errorMessage = 'No se pudo identificar el usuario';
    return;
  }

  const updatedUser: User = {
    id: currentUser.userId,
    nombre: this.editingUser.nombre || '',
    apellido: this.editingUser.apellido || '',
    email: this.editingUser.email || '',
    telefono: this.editingUser.telefono || '',
    ciudad: this.editingUser.ciudad || '',
    barrio: this.editingUser.barrio || '',
    clave: this.user.email || '', // No se actualiza en backend, pero se envía el actual
    rol_id: 1 // No se actualiza en backend, pero se envía el actual
  };

  this.userService.updateUser(updatedUser).subscribe({
    next: (response) => {
      this.user = { ...this.editingUser };
      if (this.tempPreviewImage) {
        this.previewImage = this.tempPreviewImage;
      }
      
      this.authService.refreshCurrentUser().subscribe({
        error: (err) => console.error('Error al refrescar usuario:', err)
      });
      
      this.successMessage = 'Perfil actualizado correctamente';
      this.closeModal();
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.successMessage = '';
        this.cdr.detectChanges();
      }, 5000);
    },
    error: (error) => {
      console.error('Error al actualizar perfil:', error);
      this.errorMessage = 'Error al guardar los cambios. Intenta nuevamente.';
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.errorMessage = '';
        this.cdr.detectChanges();
      }, 5000);
    }
  });
}
}