import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UniversitatsService } from '../../services/universitats-service';
import { Universitat } from '../../models/Universitat';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoginMode = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  universitats = signal<Universitat[]>([]);

  // Login fields
  loginUsername = '';
  loginPassword = '';

  // Register fields
  registerUsername = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerName = '';
  registerGenere = '';
  registerLanguage = '';
  registerDestinationUniversity = '';
  registerLocalUniversity = '';

  constructor(
    private authService: AuthService,
    private universitatsService: UniversitatsService,
    private router: Router
  ) {
    this.universitatsService.getUniversitats().subscribe(data => {
      this.universitats.set(data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onLogin() {
    this.errorMessage.set('');

    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginUsername, this.loginPassword).subscribe(response => {
      this.isLoading.set(false);
      if (response.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set(response.message || 'Error al iniciar sesión');
      }
    });
  }

  onRegister() {
    this.errorMessage.set('');

    if (!this.registerUsername || !this.registerPassword || !this.registerName ||
        !this.registerGenere || !this.registerLanguage ||
        !this.registerDestinationUniversity || !this.registerLocalUniversity) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (this.registerPassword.length < 4) {
      this.errorMessage.set('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    this.isLoading.set(true);

    this.authService.register({
      username: this.registerUsername,
      password: this.registerPassword,
      name: this.registerName,
      genere: this.registerGenere,
      language: this.registerLanguage,
      destination_university: this.registerDestinationUniversity,
      local_university: this.registerLocalUniversity
    }).subscribe(response => {
      this.isLoading.set(false);
      if (response.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set(response.message || 'Error al registrarse');
      }
    });
  }
}
