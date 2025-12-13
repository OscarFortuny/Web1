import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  busqueda = signal('');

  onSearch() {
    console.log('Searching for:', this.busqueda());
    // Aquí puedes agregar la lógica para realizar la búsqueda
  }

  listaPruebas = [
    'Universitat Rovira i Virgili',
    'Universitat de Barcelona',
    'Universitat Autònoma de Barcelona',
    'Universitat Politècnica de Catalunya',
    'Universitat Pompeu Fabra',
    'Universitat de Girona',
    'Universitat de Lleida',
    'Universitat de Tarragona',
  ];

  listaFiltrada() {
    const termino = this.busqueda().toLowerCase();
    return this.listaPruebas.filter(universidad =>
      universidad.toLowerCase().includes(termino)
    );
  }

}
