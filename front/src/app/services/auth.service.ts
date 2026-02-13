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
  private readonly SESSION_DURATION_MINUTES = 10;
  private userCache: LoginResponse | null = null;
  private userUpdated$ = new BehaviorSubject<LoginResponse | null>(null);
  public userUpdates$ = this.userUpdated$.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private setCookie(name: string, value: string, minutes: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (10000));
    const expires = `expires=${date.toUTCString()}`;
    const isProduction = location.protocol === 'https:';
    const secureFlag = isProduction ? ';Secure' : '';
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${secureFlag}`;
  }

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

  private deleteCookie(name: string): void {
    const isProduction = location.protocol === 'https:';
    const secureFlag = isProduction ? ';Secure' : '';
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict${secureFlag}`;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, clave: password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setCookie(this.TOKEN_KEY, response.token, this.SESSION_DURATION_MINUTES);
          this.userCache = response;
          this.userUpdated$.next(response);
        })
      );
  }

  logout(): void {
    this.deleteCookie(this.TOKEN_KEY);
    this.userCache = null;
    this.userUpdated$.next(null);
    this.router.navigate(['/home']);
  }

  borrarCacheUsuario(): void {
    this.userCache = null;
    this.userUpdated$.next(null);
  } 
  getToken(): string | null {
    return this.getCookie(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  loadCurrentUser(): Observable<LoginResponse> {
    if (!this.isAuthenticated()) {
      this.userCache = null;
      this.userUpdated$.next(null);
      return new Observable(observer => {
        observer.error('No hay token de autenticación');
      });
    }

    return this.http.get<LoginResponse>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        this.userCache = response;
        this.userUpdated$.next(response);
      })
    );
  }

  getCurrentUser(): LoginResponse | null {
    return this.userCache;
  }

  getCurrentUserId(): number | null {
    return this.userCache ? this.userCache.userId : null;
  }

  refreshCurrentUser(): Observable<LoginResponse> {
    this.userCache = null;
    return this.loadCurrentUser();
  }

  validateToken(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate`);
  }

  getCurrentUserName(): string | null {
    return this.userCache ? this.userCache.nombre : null;
  }

  updateUserNameInCache(nombre: string): void {
    if (this.userCache) {
      this.userCache.nombre = nombre;
      this.userUpdated$.next(this.userCache);
    }
  }
}
