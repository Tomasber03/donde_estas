import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Publicacion } from '../features/models.model';

@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private apiUrl = 'http://localhost:8080/publicacion';
  constructor(private http: HttpClient) {} 
  getPublicacions(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching Publicacions:', error);
        return of([]);
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

  createPublicacion(publicacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, publicacion).pipe(
      catchError(error => {
        console.error('Error creating Publicacion:', error);
        return throwError(() => error);
      })
    );
  }

  marcarRecuperado(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/recuperado`, {}).pipe(
      catchError(error => {
        console.error('Error marking as recuperado:', error);
        return throwError(() => error);
      })
    );
  }

  marcarAdoptado(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/adoptado`, {}).pipe(
      catchError(error => {
        console.error('Error marking as adoptado:', error);
        return throwError(() => error);
      })
    );
  }
}