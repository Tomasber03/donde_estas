import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/UserService.service';

interface UserProfile {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  barrio?: string;
  profileImage?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile = {};

  // Datos temporales para edición en el modal
  editingUser: UserProfile = { ...this.user };

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
    console.log('loadUserData iniciado, isLoading:', this.isLoading);
    const currentUser = this.authService.getCurrentUser();
    console.log('currentUser:', currentUser);
    if (currentUser && currentUser.userId) {
      this.userService.getUser(currentUser.userId).subscribe({
        next: (userData: User) => {
          console.log('Datos del usuario desde backend:', userData);
          this.user = {
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            telefono: userData.telefono,
            ciudad: userData.ciudad,
            barrio: userData.barrio,
            profileImage: ''
          };
          console.log('user asignado:', this.user);
          this.previewImage = null;
          this.isLoading = false;
          console.log('isLoading cambiado a false');
          this.cdr.detectChanges();
          console.log('detectChanges ejecutado');
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
    // Copiar los datos actuales al objeto de edición
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

    console.log('Guardando perfil para usuario ID:', currentUser.userId);
    console.log('Datos a guardar:', this.editingUser);

    // Crear objeto User completo para enviar al backend
    const updatedUser: User = {
      id: currentUser.userId,
      nombre: this.editingUser.nombre || '',
      apellido: this.editingUser.apellido || '',
      email: this.editingUser.email || '',
      telefono: this.editingUser.telefono || '',
      ciudad: this.editingUser.ciudad || '',
      barrio: this.editingUser.barrio || '',
      clave: this.user.email || '', // No se actualiza en backend, pero se envía el actual
      rolPersistido: 'USUARIOPUBLICO' // Valor por defecto
    };

    console.log('Objeto a enviar al backend:', updatedUser);

    // Enviar cambios al backend
    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
        console.log('Usuario actualizado en backend:', response);
        
        // Actualizar datos locales solo después de éxito en backend
        this.user = { ...this.editingUser };
        if (this.tempPreviewImage) {
          this.previewImage = this.tempPreviewImage;
        }
        
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