import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UniversitatsService } from '../../services/universitats-service';
import { Grups } from '../../services/grups';
import { Usuaris } from '../../services/usuaris';
import { Universitat } from '../../models/Universitat';
import { Grup } from '../../models/Grup';
import { User as Usuari } from '../../models/User';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user = signal<User | null>(null);
  grup = signal<Grup | null>(null);
  groupMembers = signal<Usuari[]>([]);
  universidadesMap = signal<Map<string, string>>(new Map());
  isLoading = signal(true);
  isLeavingGroup = signal(false);

  constructor(
    private authService: AuthService,
    private universitatsService: UniversitatsService,
    private grupsService: Grups,
    private usuarisService: Usuaris,
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
          this.loadGroupMembers(grup.usuaris);
        },
        error: () => {
          this.grup.set(null);
          this.groupMembers.set([]);
        }
      });
    } else {
      this.grup.set(null);
      this.groupMembers.set([]);
    }
  }

  loadGroupMembers(userIds: string[]) {
    if (!userIds || userIds.length === 0) {
      this.groupMembers.set([]);
      return;
    }

    this.usuarisService.getUsuaris().subscribe({
      next: (usuaris: Usuari[]) => {
        const members = usuaris.filter(u =>
          userIds.includes(u.usuari_id.toString())
        );
        this.groupMembers.set(members);
      },
      error: () => {
        this.groupMembers.set([]);
      }
    });
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

    if (!confirm('Estàs segur que vols sortir del grup? Si ets l\'\u00faltim membre, el grup s\'eliminarà.')) {
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
        alert('Error en sortir del grup. Si us plau, torna-ho a intentar.');
        this.isLeavingGroup.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
