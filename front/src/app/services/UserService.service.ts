import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id: number; 
  nombre: string; 
  apellido: string; 
  clave?: string; 
  email: string; 
  telefono: string; 
  barrio?: string; 
  ciudad?: string; 
  dni?: string;
  rolNuevo?: {
    id: number;
    nombre: string;
  };
  rolPersistido?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/user';
  
  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  /**
   * Obtiene todos los usuarios (requiere permisos de admin)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]); // no propaga el error
        //return throwError(() => error); // propaga el error
      })
    );
  }
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      })
    );
  }
  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl + "/crear", user).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }
}