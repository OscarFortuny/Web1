import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UniversitatsService } from '../../services/universitats-service';
import { Grups } from '../../services/grups';
import { Universitat } from '../../models/Universitat';
import { Grup } from '../../models/Grup';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user = signal<User | null>(null);
  grup = signal<Grup | null>(null);
  universidadesMap = signal<Map<string, string>>(new Map());
  isLoading = signal(true);
  isLeavingGroup = signal(false);

  constructor(
    private authService: AuthService,
    private universitatsService: UniversitatsService,
    private grupsService: Grups,
    private router: Router
  ) {
    this.loadUserData();
  }

  loadUserData() {
    // Verificar si hay usuario logueado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user.set(this.authService.currentUser());

    // Cargar universidades
    this.universitatsService.getUniversitats().subscribe((universitats: Universitat[]) => {
      const map = new Map<string, string>();
      universitats.forEach((uni: Universitat) => {
        map.set(uni.universitat_id.toString(), uni.name);
      });
      this.universidadesMap.set(map);
      this.isLoading.set(false);
    });

    // Cargar grupo del usuario si tiene uno
    this.loadUserGroup();
  }

  loadUserGroup() {
    const currentUser = this.authService.currentUser();
    if (currentUser?.grup_id) {
      this.grupsService.getGrupById(currentUser.grup_id).subscribe({
        next: (grup: Grup) => {
          this.grup.set(grup);
        },
        error: () => {
          this.grup.set(null);
        }
      });
    } else {
      this.grup.set(null);
    }
  }

  getUniversitatName(id: string | number | undefined): string {
    if (!id) return 'No especificada';
    const map = this.universidadesMap();
    return map.get(id.toString()) || 'Desconocida';
  }

  leaveGroup() {
    const currentUser = this.user();
    const currentGrup = this.grup();

    if (!currentUser || !currentGrup) return;

    if (!confirm('¿Estás seguro de que quieres salir del grupo? Si eres el último miembro, el grupo se eliminará.')) {
      return;
    }

    this.isLeavingGroup.set(true);

    this.grupsService.leaveGrup(currentGrup.grup_id, currentUser.usuari_id).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar el usuario local
          const updatedUser = { ...currentUser, grup_id: undefined };
          this.authService.updateCurrentUser(updatedUser);
          this.user.set(updatedUser);
          this.grup.set(null);
          alert(response.message);
        }
        this.isLeavingGroup.set(false);
      },
      error: (error) => {
        console.error('Error leaving group:', error);
        alert('Error al salir del grupo. Por favor, inténtalo de nuevo.');
        this.isLeavingGroup.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
