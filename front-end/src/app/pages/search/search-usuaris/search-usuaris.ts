import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { Usuaris } from '../../../services/usuaris';
import { UniversitatsService } from '../../../services/universitats-service';
import { Universitat } from '../../../models/Universitat';
import { Grups } from '../../../services/grups';
import { Grup } from '../../../models/Grup';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-search-usuaris',
  imports: [CommonModule],
  templateUrl: './search-usuaris.html',
  styleUrl: './search-usuaris.css',
})
export class SearchUsuaris {
  busqueda = signal('');
  llistaUsuaris = signal<User[]>([]);
  universidadesMap = signal<Map<string, string>>(new Map());
  selectedUser = signal<User | null>(null);
  selectedUserGroup = signal<Grup | null>(null);
  isJoining = signal(false);
  joinError = signal('');
  joinSuccess = signal('');

  constructor(
    private usuarisService: Usuaris,
    private universitatsService: UniversitatsService,
    private grupsService: Grups,
    public authService: AuthService
  ) {
    // Cargar universidades
    this.universitatsService.getUniversitats().subscribe((universitats: Universitat[]) => {
      const map = new Map<string, string>();
      universitats.forEach((uni: Universitat) => {
        map.set(uni.universitat_id.toString(), uni.name);
      });
      this.universidadesMap.set(map);
    });

    // Cargar usuarios
    this.usuarisService.getUsuaris().subscribe(data => {
      this.llistaUsuaris.set(data);
    });
  }

  onSearch() {
    console.log('Searching for:', this.busqueda());
  }

  getUniversitatName(id: string | number | undefined): string {
    if (!id) return 'Desconocida';
    const map = this.universidadesMap();
    return map.get(id.toString()) || 'Desconocida';
  }

  listaFiltrada() {
    const termino = this.busqueda().toLowerCase();
    return this.llistaUsuaris().filter((usuari: User) => {
      const coincideName = (usuari.name as string).toLowerCase().includes(termino);
      const coincideUsername = (usuari.username as string).toLowerCase().includes(termino);
      return coincideName || coincideUsername;
    });
  }

  selectUser(user: User) {
    console.log('selectUser called with:', user);
    this.selectedUser.set(user);
    this.selectedUserGroup.set(null);
    this.joinError.set('');
    this.joinSuccess.set('');

    // Cargar el grupo del usuario si tiene uno
    const userWithGroup = user as any;
    if (userWithGroup.grup_id) {
      this.grupsService.getGrupById(userWithGroup.grup_id).subscribe({
        next: (grup) => {
          this.selectedUserGroup.set(grup);
        },
        error: () => {
          this.selectedUserGroup.set(null);
        }
      });
    }
  }

  closeModal() {
    this.selectedUser.set(null);
    this.selectedUserGroup.set(null);
    this.joinError.set('');
    this.joinSuccess.set('');
  }

  canJoinGroup(): boolean {
    const currentUser = this.authService.currentUser();
    const group = this.selectedUserGroup();

    if (!currentUser || !group) return false;
    if (currentUser.grup_id) return false; // Ya tiene grupo
    if (group.usuaris.length >= 4) return false; // Grupo lleno

    // Verificar misma universidad de destino
    return currentUser.destination_university?.toString() === group.universitat_id?.toString();
  }

  joinGroup() {
    const currentUser = this.authService.currentUser();
    const group = this.selectedUserGroup();

    if (!currentUser || !group) return;

    this.isJoining.set(true);
    this.joinError.set('');
    this.joinSuccess.set('');

    this.grupsService.joinGrup(group.grup_id, currentUser.usuari_id).subscribe({
      next: (response) => {
        this.isJoining.set(false);
        if (response.success) {
          this.joinSuccess.set('T\'has unit al grup correctament!');
          // Actualizar usuario local
          const updatedUser = { ...currentUser, grup_id: group.grup_id };
          this.authService.updateCurrentUser(updatedUser);

          // Actualizar la lista de usuarios del grupo en el modal
          const updatedGroup = { ...group, usuaris: [...group.usuaris, String(currentUser.usuari_id)] };
          this.selectedUserGroup.set(updatedGroup);
        } else {
          this.joinError.set(response.error || 'Error en unir-se al grup');
        }
      },
      error: (error) => {
        this.isJoining.set(false);
        this.joinError.set(error.error?.error || 'Error en unir-se al grup');
      }
    });
  }
}
