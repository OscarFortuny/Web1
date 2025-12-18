import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Grup } from '../models/Grup';

export interface CreateGrupRequest {
  name: string;
  universitat_id: string;
  description?: string;
  creador_id: number;
}

export interface CreateGrupResponse {
  success: boolean;
  grup?: Grup;
  error?: string;
}

export interface LeaveGrupResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface JoinGrupResponse {
  success: boolean;
  message: string;
  grup_id?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Grups {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/grups';

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-user-secret': 'supersecret'
    });
  }

  getGrups() {
    return this.http.get<Grup[]>(this.apiUrl);
  }

  getGrupById(id: number): Observable<Grup> {
    return this.http.get<Grup>(`${this.apiUrl}/${id}`);
  }

  createGrup(data: CreateGrupRequest): Observable<CreateGrupResponse> {
    return this.http.post<CreateGrupResponse>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  addGrup(grup: Grup): Observable<Grup> {
    return this.http.post<Grup>(this.apiUrl, grup, { headers: this.getAuthHeaders() });
  }

  updateGrup(id: number, grup: Grup): Observable<Grup> {
    return this.http.put<Grup>(`${this.apiUrl}/${id}`, grup, { headers: this.getAuthHeaders() });
  }

  leaveGrup(grupId: number, usuariId: number): Observable<LeaveGrupResponse> {
    return this.http.post<LeaveGrupResponse>(
      `${this.apiUrl}/${grupId}/leave`,
      { usuari_id: usuariId },
      { headers: this.getAuthHeaders() }
    );
  }

  joinGrup(grupId: number, usuariId: number): Observable<JoinGrupResponse> {
    return this.http.post<JoinGrupResponse>(
      `${this.apiUrl}/${grupId}/join`,
      { usuari_id: usuariId },
      { headers: this.getAuthHeaders() }
    );
  }
}
