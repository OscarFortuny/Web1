import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, interval, switchMap, startWith } from 'rxjs';
import { Missatge, SendMissatgeRequest, SendMissatgeResponse } from '../models/Missatge';

@Injectable({
  providedIn: 'root',
})
export class MissatgesService {
  private apiUrl = 'http://localhost:3000/missatges';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-user-secret': 'supersecret'
    });
  }

  // Obtenir missatges d'un grup
  getMissatges(grupId: number, limit?: number): Observable<Missatge[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<Missatge[]>(`${this.apiUrl}/${grupId}`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Obtenir missatges nous des d'un timestamp
  getMissatgesSince(grupId: number, since: string): Observable<Missatge[]> {
    const params = new HttpParams().set('since', since);
    return this.http.get<Missatge[]>(`${this.apiUrl}/${grupId}`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Enviar un missatge
  sendMissatge(grupId: number, missatge: SendMissatgeRequest): Observable<SendMissatgeResponse> {
    return this.http.post<SendMissatgeResponse>(`${this.apiUrl}/${grupId}`, missatge, {
      headers: this.getAuthHeaders()
    });
  }

  // Polling per obtenir missatges nous cada 3 segons
  pollMissatges(grupId: number, intervalMs: number = 3000): Observable<Missatge[]> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getMissatges(grupId, 100))
    );
  }
}
