import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Grup } from '../../../models/Grup';
import { Grups } from '../../../services/grups';
import { UniversitatsService } from '../../../services/universitats-service';
import { Universitat } from '../../../models/Universitat';
import { Usuaris } from '../../../services/usuaris';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-search-grups',
  imports: [CommonModule],
  templateUrl: './search-grups.html',
  styleUrl: './search-grups.css',
})
export class SearchGrups {
  busqueda = signal('');
  universidadSeleccionada = signal('');
  llistaGrups = signal<Grup[]>([]);
  llistaUniversitats = signal<Universitat[]>([]);
  universidadesMap = signal<Map<string, string>>(new Map());
  usuariosMap = signal<Map<number, User>>(new Map());

  selectedGroup = signal<Grup | null>(null);
  groupMembers = signal<User[]>([]);
  isJoining = signal(false);
  joinError = signal('');
  joinSuccess = signal('');

  constructor(
    private grupsService: Grups,
    private universitatsService: UniversitatsService,
    private usuarisService: Usuaris,
    public authService: AuthService
  ) {
    // Cargar universidades
    this.universitatsService.getUniversitats().subscribe((universitats: Universitat[]) => {
      this.llistaUniversitats.set(universitats);
      const map = new Map<string, string>();
      universitats.forEach((uni: Universitat) => {
        map.set(uni.universitat_id.toString(), uni.name);
      });
      this.universidadesMap.set(map);
    });

    // Cargar usuarios para mapear IDs a nombres
    this.usuarisService.getUsuaris().subscribe((usuarios: User[]) => {
      const map = new Map<number, User>();
      usuarios.forEach((user: User) => {
        map.set(user.usuari_id, user);
      });
      this.usuariosMap.set(map);
    });

    // Cargar grupos
    this.grupsService.getGrups().subscribe(data => {
      this.llistaGrups.set(data);
    });
  }

  onSearch() {
    console.log('Searching for:', this.busqueda());
  }

  onUniversidadChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.universidadSeleccionada.set(value);
  }

  getUniversitats(): Universitat[] {
    return this.llistaUniversitats().sort((a, b) => a.name.localeCompare(b.name));
  }

  getUniversitatName(id: string | number | undefined): string {
    if (!id) return 'Desconocida';
    const map = this.universidadesMap();
    return map.get(id.toString()) || 'Desconocida';
  }

  listaFiltrada() {
    const termino = this.busqueda().toLowerCase();
    const universitat = this.universidadSeleccionada();

    return this.llistaGrups().filter((grup: Grup) => {
      const coincideName = (grup.name as string).toLowerCase().includes(termino);
      const coincideUniversitat = !universitat || grup.universitat_id.toString() === universitat.toString();
      return coincideName && coincideUniversitat;
    });
  }

  selectGroup(grup: Grup) {
    console.log('selectGroup called with:', grup);
    this.selectedGroup.set(grup);
    this.joinError.set('');
    this.joinSuccess.set('');

    // Cargar los miembros del grupo
    const members: User[] = [];
    const usuariosMapValue = this.usuariosMap();

    grup.usuaris.forEach((usuariId: string | number) => {
      const user = usuariosMapValue.get(Number(usuariId));
      if (user) {
        members.push(user);
      }
    });

    this.groupMembers.set(members);
  }

  closeModal() {
    this.selectedGroup.set(null);
    this.groupMembers.set([]);
    this.joinError.set('');
    this.joinSuccess.set('');
  }

  canJoinGroup(): boolean {
    const currentUser = this.authService.currentUser();
    const group = this.selectedGroup();

    if (!currentUser || !group) return false;
    if (currentUser.grup_id) return false; // Ya tiene grupo
    if (group.usuaris.length >= 4) return false; // Grupo lleno

    // Verificar misma universidad de destino
    return currentUser.destination_university?.toString() === group.universitat_id?.toString();
  }

  joinGroup() {
    const currentUser = this.authService.currentUser();
    const group = this.selectedGroup();

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

          // Actualizar la lista de miembros
          const currentMembers = this.groupMembers();
          this.groupMembers.set([...currentMembers, currentUser as any]);

          // Actualizar el grupo en la lista
          const updatedGroup = { ...group, usuaris: [...group.usuaris, currentUser.usuari_id.toString()] };
          this.selectedGroup.set(updatedGroup);

          // Actualizar la lista general de grupos
          const grups = this.llistaGrups();
          const updatedGrups = grups.map(g => g.grup_id === group.grup_id ? updatedGroup : g);
          this.llistaGrups.set(updatedGrups);
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
