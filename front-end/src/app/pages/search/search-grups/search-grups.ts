import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grup } from '../../../models/Grup';
import { Grups } from '../../../services/grups';
import { UniversitatsService } from '../../../services/universitats-service';
import { Universitat } from '../../../models/Universitat';

@Component({
  selector: 'app-search-grups',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-grups.html',
  styleUrl: './search-grups.css',
})
export class SearchGrups {
  busqueda = signal('');
  universidadSeleccionada = signal('');
  llistaGrups = signal<Grup[]>([]);
  llistaUniversitats = signal<Universitat[]>([]);
  universidadesMap = signal<Map<string, string>>(new Map());

  constructor(private grupsService: Grups, private universitatsService: UniversitatsService) {
    // Cargar universidades
    this.universitatsService.getUniversitats().subscribe((universitats: Universitat[]) => {
      this.llistaUniversitats.set(universitats);
      const map = new Map<string, string>();
      universitats.forEach((uni: Universitat) => {
        map.set(uni.universitat_id.toString(), uni.name);
      });
      this.universidadesMap.set(map);
    });

    // Cargar grupos
    this.grupsService.getUniversitats().subscribe(data => {
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

  getUniversitatName(id: string | number): string {
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
}
