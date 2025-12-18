import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/User';
import { Usuaris } from '../../../services/usuaris';
import { UniversitatsService } from '../../../services/universitats-service';
import { Universitat } from '../../../models/Universitat';

@Component({
  selector: 'app-search-usuaris',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-usuaris.html',
  styleUrl: './search-usuaris.css',
})
export class SearchUsuaris {
  busqueda = signal('');
  llistaUsuaris = signal<User[]>([]);
  universidadesMap = signal<Map<string, string>>(new Map());

  constructor(private usuarisService: Usuaris, private universitatsService: UniversitatsService) {
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

  getUniversitatName(id: string | number): string {
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
}
