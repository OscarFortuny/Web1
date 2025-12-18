import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface User {
  usuari_id: number;
  username: string;
  name: string;
  genere?: string;
  language?: string;
  destination_university?: string;
  local_university?: string;
  grup_id?: number;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuaris';
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);

  constructor(private http: HttpClient) {
    // Recuperar sesión del localStorage (solo en navegador)
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUser.set(response.user);
          this.isLoggedIn.set(true);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({ success: false, message: error.error?.message || 'Error de conexión' });
      })
    );
  }

  register(userData: {
    username: string;
    password: string;
    name: string;
    genere: string;
    language: string;
    destination_university: string;
    local_university: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUser.set(response.user);
          this.isLoggedIn.set(true);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        return of({ success: false, message: error.error?.message || 'Error de conexión' });
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

  updateCurrentUser(user: User): void {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    return this.currentUser();
  }
}
