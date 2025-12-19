import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvistamientoRequest {
  comentario: string;
  usuarioId: number;
  publicacionId: number;
  ubicacion: {
    ciudad: string;
    barrio: string;
    latitud: string;
    longitud: string;
  };
  fotos?: Array<{
    nombre: string;
    url: string;
    descripcion?: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class AvistamientoService {
  private apiUrl = 'http://localhost:8080/avistamiento';

  constructor(private http: HttpClient) {}

  createAvistamiento(avistamiento: AvistamientoRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, avistamiento);
  }

  getAvistamiento(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
