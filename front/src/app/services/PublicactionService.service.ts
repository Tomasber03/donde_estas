import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/*
ejemplo de publicacion 
[
  {
    "id": 1,
    "mascota": {
      "id": 1,
      "nombre": "",
      "raza": "",
      "color": "",
      "tamano": "",
      "tipo": ""
    },
    "avistamientos": [],
    "activo": true,
    "estadoInicial": "PERDIDO_PROPIO",
    "estadoCierre": "RECUPERADO",
    "fechaInicial": "2025-11-14T17:15:00",
    "fechaModificacion": "2025-11-14T17:15:00",
    "ubicacion": {
      "id": 1,
      "ciudad": "dfgdg",
      "barrio": "dfgdg",
      "latitud": "-34.6037",
      "longitud": "-58.3816"
    },
    "descripcion": "Mascota perdida cerca del parque."
  }
]
*/
export interface Mascota {id: number; nombre: string; raza: string; color: string; tamano: string; tipo: string;}
export interface Ubicacion {id: number; ciudad: string; barrio: string; latitud: string; longitud: string;}

export interface Publicacion {id: number; mascota: Mascota; avistamientos: any[]; activo: boolean; estadoInicial: string; estadoCierre: string; fechaInicial: string; fechaModificacion: string; ubicacion: Ubicacion; descripcion: string;}
@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private apiUrl = 'http://localhost:8080/publicacion';
  constructor(private http: HttpClient) {} 
  getPublicacions(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching Publicacions:', error);
        return of([]); // no propaga el error
        //return throwError(() => error); // propaga el error
      })
    );
  }
  getPublicacion(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching Publicacion:', error);
        return throwError(() => error);
      })
    );
  }
  addPublicacion(Publicacion: Partial<Publicacion>): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.apiUrl + "/crear", Publicacion).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  updatePublicacion(Publicacion: Publicacion): Observable<Publicacion> {
    return this.http.put<Publicacion>(`${this.apiUrl}/${Publicacion.id}`, Publicacion).pipe(
      catchError(error => {
        console.error('Error updating Publicacion:', error);
        return throwError(() => error);
      })
    );
  }
  deletePublicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting Publicacion:', error);
        return throwError(() => error);
      })
    );
  }
}