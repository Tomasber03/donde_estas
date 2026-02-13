import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  clave: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  nombre: string;
  rol: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Autentica al usuario con email y contraseña
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, clave: password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          // Guardar token y datos del usuario en localStorage
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response));
        })
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/home']);
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  /**
   * Obtiene los datos del usuario actual
   */
  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtiene el ID del usuario actual
   */
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.userId : null;
  }

  /**
   * Valida el token con el backend
   */
  validateToken(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate`);
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'ADMIN';
  }
}
