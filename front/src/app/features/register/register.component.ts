import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/UserService.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styles: [`
    :host {
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
  `]
})

export class RegisterComponent {

  users: User[] = [];
  form: Partial<User> = { nombre: '', apellido: '', clave: '', email: '', telefono: '', barrio: '', ciudad: '', rolPersistido: 'USUARIOPUBLICO' };
  errorMessage = '';
  constructor(private service: UserService) {
  }
  save() {
    const request = this.service.addUser(this.form);
    request.subscribe({
      next: () => {
        this.resetForm();
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al guardar el héroe';
      }
    });
  } 
  
  cancel() {
    this.resetForm();
    this.errorMessage = '';
  }
  private resetForm() {
    this.form = { nombre: '', apellido: '', clave: '', email: '', telefono: '', barrio: '', ciudad: ''};
  }
}
