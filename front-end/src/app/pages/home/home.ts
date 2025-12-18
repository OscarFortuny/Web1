import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UniversitatsService } from '../../services/universitats-service';
import { Grups } from '../../services/grups';
import { Usuaris } from '../../services/usuaris';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Estadístiques
  totalUniversitats = signal<number>(0);
  totalGrups = signal<number>(0);
  totalEstudiants = signal<number>(0);
  totalPaisos = signal<number>(0);

  constructor(
    public authService: AuthService,
    private universitatsService: UniversitatsService,
    private grupsService: Grups,
    private usuarisService: Usuaris
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      universitats: this.universitatsService.getUniversitats(),
      grups: this.grupsService.getGrups(),
      usuaris: this.usuarisService.getUsuaris()
    }).subscribe({
      next: (data) => {
        this.totalUniversitats.set(data.universitats.length);
        this.totalGrups.set(data.grups.length);
        this.totalEstudiants.set(data.usuaris.length);

        // Comptar països únics de les universitats
        const paisos = new Set(data.universitats.map(u => u.country));
        this.totalPaisos.set(paisos.size);
      },
      error: (err) => {
        console.error('Error carregant estadístiques:', err);
      }
    });
  }

  userHasGroup(): boolean {
    const user = this.authService.currentUser();
    return !!user?.grup_id;
  }
}
