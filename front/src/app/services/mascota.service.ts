import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FotoMascota {
  id?: number;
  nombre: string;
  url?: string;
  descripcion?: string;
  fechaCreacion?: string;
}

export interface Mascota {
  id?: number;
  nombre: string;
  raza: string;
  color: string;
  tamano: string;
  tipo: string;
  sexo: string;
  fotos?: FotoMascota[];
}

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private apiUrl = 'http://localhost:8080/mascota';

  constructor(private http: HttpClient) {}

  getMascotasByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      catchError(error => {
        console.error('Error fetching mascotas:', error);
        return throwError(() => error);
      })
    );
  }

  getMascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching mascota:', error);
        return throwError(() => error);
      })
    );
  }

  createMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota).pipe(
      catchError(error => {
        console.error('Error creating mascota:', error);
        return throwError(() => error);
      })
    );
  }

  updateMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/${mascota.id}`, mascota).pipe(
      catchError(error => {
        console.error('Error updating mascota:', error);
        return throwError(() => error);
      })
    );
  }
}
