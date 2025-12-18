import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class Usuaris {
  private apiUrl = 'http://localhost:3000/usuaris';

  constructor(private http: HttpClient) { }

  getUsuaris(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUsuariById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUsuari(usuari: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, usuari);
  }

  updateUsuari(id: number, usuari: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, usuari);
  }

  deleteUsuari(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
