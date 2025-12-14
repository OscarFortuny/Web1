import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Universitat } from '../../../models/Universitat';
import { UniversitatsService } from '../../../services/universitats-service';

@Component({
  selector: 'app-search-universitats',
  imports: [CommonModule],
  templateUrl: './search-universitats.html',
  styleUrl: './search-universitats.css',
})
export class SearchUniversitats {
  busqueda = signal('');
  paisSeleccionado = signal('');
  llistaUniversitats = signal<Universitat[]>([]);

  constructor(private universitatsService: UniversitatsService) {
    this.universitatsService.getUniversitats().subscribe(data => {
      this.llistaUniversitats.set(data);
    });
  }

  onSearch() {
    console.log('Searching for:', this.busqueda());
  }

  onCountryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.paisSeleccionado.set(value);
  }

  getPaises(): string[] {
    const paises = new Set(this.llistaUniversitats().map(u => u.country));
    return Array.from(paises).sort() as string[];
  }

  listaFiltrada() {
    const termino = this.busqueda().toLowerCase();
    const pais = this.paisSeleccionado();

    return this.llistaUniversitats().filter((universitat: Universitat) => {
      const coincideName = universitat.name.toLowerCase().includes(termino);
      const coincidePais = !pais || universitat.country === pais;
      return coincideName && coincidePais;
    });
  }
}
