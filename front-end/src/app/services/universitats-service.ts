import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Universitat } from '../models/Universitat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UniversitatsService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/universitats';

  getUniversitats() {
    return this.http.get<Universitat[]>(this.apiUrl);
  }

  getUniversitatById(id: number): Observable<Universitat> {
    return this.http.get<Universitat>(`${this.apiUrl}/${id}`);
  }
}
