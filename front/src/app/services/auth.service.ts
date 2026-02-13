import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
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
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  // Subject para notificar cambios en los datos del usuario
  private userUpdated$ = new BehaviorSubject<LoginResponse | null>(this.getCurrentUser());
  public userUpdates$ = this.userUpdated$.asObservable();

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
          // Emitir el cambio para que los componentes suscritos se actualicen
          this.userUpdated$.next(response);
        })
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // Emitir null para indicar que no hay usuario
    this.userUpdated$.next(null);
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
  * Actualiza los datos del usuario actual en localStorage
  */
  updateCurrentUser(nombre: string): void {
    const user = this.getCurrentUser();
    if (user) {
      user.nombre = nombre;
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      // Emitir el cambio para que los componentes suscritos se actualicen
      this.userUpdated$.next(user);
    }
  }

  /**
   * Valida el token con el backend
   */
  validateToken(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate`);
  }
  
}
