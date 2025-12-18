import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Grups } from '../../services/grups';
import { UniversitatsService } from '../../services/universitats-service';
import { Universitat } from '../../models/Universitat';

@Component({
  selector: 'app-create-group',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css',
})
export class CreateGroup {
  groupName = '';
  groupDescription = '';

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  destinationUniversity = signal<Universitat | null>(null);

  constructor(
    public authService: AuthService,
    private grupsService: Grups,
    private universitatsService: UniversitatsService,
    private router: Router
  ) {
    // Verificar si hay usuario logueado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si el usuario ya pertenece a un grupo
    const user = this.authService.currentUser();
    if (user?.grup_id) {
      this.router.navigate(['/profile']);
      return;
    }

    // Cargar la universidad de destino del usuario
    if (user?.destination_university) {
      this.universitatsService.getUniversitats().subscribe((universitats: Universitat[]) => {
        const uni = universitats.find(u => u.universitat_id.toString() === user.destination_university?.toString());
        if (uni) {
          this.destinationUniversity.set(uni);
        }
      });
    }
  }

  onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.groupName.trim()) {
      this.errorMessage.set('El nom del grup és obligatori');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.errorMessage.set('Has d\'iniciar sessió per crear un grup');
      return;
    }

    if (!user.destination_university) {
      this.errorMessage.set('No tens una universitat de destí configurada');
      return;
    }

    this.isLoading.set(true);

    this.grupsService.createGrup({
      name: this.groupName.trim(),
      universitat_id: user.destination_university,
      description: this.groupDescription.trim(),
      creador_id: user.usuari_id
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.grup) {
          // Actualizar el grup_id del usuario en el AuthService
          const updatedUser = { ...user, grup_id: response.grup.grup_id };
          this.authService.updateCurrentUser(updatedUser);

          this.successMessage.set('Grup creat amb èxit!');
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        } else {
          this.errorMessage.set(response.error || 'Error en crear el grup');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.error || 'Error en crear el grup');
      }
    });
  }
}
