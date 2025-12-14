import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Grup } from '../models/Grup';

@Injectable({
  providedIn: 'root',
})
export class Grups {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/grups';

  getUniversitats() {
    return this.http.get<Grup[]>(this.apiUrl);
  }

  getUniversitatById(id: number): Observable<Grup> {
    return this.http.get<Grup>(`${this.apiUrl}/${id}`);
  }

  addGrup(grup: Grup): Observable<Grup> {
    return this.http.post<Grup>(this.apiUrl, grup);
  }

  updateGrup(id: number, grup: Grup): Observable<Grup> {
    return this.http.put<Grup>(`${this.apiUrl}/${id}`, grup);
  }
}
