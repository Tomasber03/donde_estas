import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  onSubmit() {
    // Limpiar mensaje de error previo
    this.errorMessage = '';
    
    // Validación básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa email y contraseña';
      return;
    }

    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        
        // Obtener la URL de retorno o ir al home por defecto
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.isLoading = false;
        
        // Mostrar mensaje de error
        if (error.status === 401) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else {
          this.errorMessage = 'Error al conectar con el servidor. Intenta nuevamente.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
