import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUniversitats } from './search-universitats/search-universitats';
import { SearchUsuaris } from './search-usuaris/search-usuaris';
import { SearchGrups } from './search-grups/search-grups';

@Component({
  selector: 'app-search',
  imports: [CommonModule, SearchUniversitats, SearchUsuaris, SearchGrups],
  templateUrl: './search.html',
  styleUrl: './search.css',
})


export class Search {
  activeTab = signal<'universitats' | 'usuaris' | 'grups'>('universitats');

  selectTab(tab: 'universitats' | 'usuaris' | 'grups') {
    this.activeTab.set(tab);
  }
}
