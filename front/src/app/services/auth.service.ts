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
  
  // aca se cambia el valor de tiempo - Duración de la sesión en minutos
  private readonly SESSION_DURATION_MINUTES = 10;
  
  // Subject para notificar cambios en los datos del usuario
  private userUpdated$ = new BehaviorSubject<LoginResponse | null>(this.getCurrentUser());
  public userUpdates$ = this.userUpdated$.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Establece una cookie con opciones de seguridad
   */
  private setCookie(name: string, value: string, minutes: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    // Configuración de seguridad: SameSite previene CSRF
    // Secure solo en producción (requiere HTTPS, en localhost no funciona)
    const isProduction = location.protocol === 'https:';
    const secureFlag = isProduction ? ';Secure' : '';
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${secureFlag}`;
  }

  /**
   * Obtiene el valor de una cookie
   */
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  /**
   * Elimina una cookie
   */
  private deleteCookie(name: string): void {
    const isProduction = location.protocol === 'https:';
    const secureFlag = isProduction ? ';Secure' : '';
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict${secureFlag}`;
  }

  /**
   * Autentica al usuario con email y contraseña
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, clave: password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          // Guardar token y datos del usuario en cookies con tiempo de expiración
          this.setCookie(this.TOKEN_KEY, response.token, this.SESSION_DURATION_MINUTES);
          this.setCookie(this.USER_KEY, JSON.stringify(response), this.SESSION_DURATION_MINUTES);
          // Emitir el cambio para que los componentes suscritos se actualicen
          this.userUpdated$.next(response);
        })
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.deleteCookie(this.TOKEN_KEY);
    this.deleteCookie(this.USER_KEY);
    // Emitir null para indicar que no hay usuario
    this.userUpdated$.next(null);
    this.router.navigate(['/home']);
  }

  /**
   * Obtiene el token JWT almacenado en cookies
   */
  getToken(): string | null {
    return this.getCookie(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  /**
   * Obtiene los datos del usuario actual desde cookies
   */
  getCurrentUser(): LoginResponse | null {
    const userStr = this.getCookie(this.USER_KEY);
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
  * Actualiza los datos del usuario actual en cookies
  */
  updateCurrentUser(nombre: string): void {
    const user = this.getCurrentUser();
    if (user) {
      user.nombre = nombre;
      this.setCookie(this.USER_KEY, JSON.stringify(user), this.SESSION_DURATION_MINUTES);
      // Emitir el cambio para que los componentes suscritos se actualicen
      this.userUpdated$.next(user);
    }
  }

  /**
   * Sincroniza el estado del BehaviorSubject con las cookies reales
   * Útil para detectar cuando las cookies fueron eliminadas externamente
   */
  checkCookieState(): void {
    const currentUser = this.getCurrentUser();
    const currentSubjectValue = this.userUpdated$.value;
    
    // Si el BehaviorSubject dice que hay usuario pero las cookies no existen
    if (currentSubjectValue && !currentUser) {
      this.userUpdated$.next(null);
    }
    // Si las cookies existen pero el BehaviorSubject está en null
    else if (!currentSubjectValue && currentUser) {
      this.userUpdated$.next(currentUser);
    }
  }

  /**
   * Valida el token con el backend
   */
  validateToken(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate`);
  }
  
}
