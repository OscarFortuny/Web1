import { Component, signal, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MissatgesService } from '../../services/missatges.service';
import { Grups } from '../../services/grups';
import { Missatge } from '../../models/Missatge';
import { Grup } from '../../models/Grup';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  missatges = signal<Missatge[]>([]);
  grup = signal<Grup | null>(null);
  newMessage = '';
  isLoading = signal(true);
  isSending = signal(false);
  error = signal<string | null>(null);

  private pollingSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(
    public authService: AuthService,
    private missatgesService: MissatgesService,
    private grupsService: Grups,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar que l'usuari està autenticat i té un grup
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser?.grup_id) {
      this.router.navigate(['/']);
      return;
    }

    // Carregar informació del grup
    this.loadGrup(currentUser.grup_id);
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadGrup(grupId: number) {
    this.grupsService.getGrupById(grupId).subscribe({
      next: (grup) => {
        this.grup.set(grup);
        this.startPolling(grupId);
      },
      error: () => {
        this.error.set('Error carregant el grup');
        this.isLoading.set(false);
      }
    });
  }

  startPolling(grupId: number) {
    // Polling cada 2 segons per obtenir nous missatges
    this.pollingSubscription = this.missatgesService.pollMissatges(grupId, 2000).subscribe({
      next: (missatges) => {
        const currentMissatges = this.missatges();
        // Només actualitzar si hi ha canvis
        if (missatges.length !== currentMissatges.length ||
            (missatges.length > 0 && currentMissatges.length > 0 &&
             missatges[missatges.length - 1].missatge_id !== currentMissatges[currentMissatges.length - 1].missatge_id)) {
          this.missatges.set(missatges);
          this.shouldScrollToBottom = true;
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error carregant missatges');
        this.isLoading.set(false);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isSending()) return;

    const currentUser = this.authService.currentUser();
    const currentGrup = this.grup();

    if (!currentUser || !currentGrup) return;

    this.isSending.set(true);

    this.missatgesService.sendMissatge(currentGrup.grup_id, {
      usuari_id: currentUser.usuari_id,
      usuari_name: currentUser.name,
      text: this.newMessage.trim()
    }).subscribe({
      next: (response) => {
        if (response.success && response.missatge) {
          // Afegir el missatge a la llista localment per a resposta immediata
          const currentMissatges = this.missatges();
          this.missatges.set([...currentMissatges, response.missatge]);
          this.newMessage = '';
          this.shouldScrollToBottom = true;
        }
        this.isSending.set(false);
      },
      error: () => {
        this.error.set('Error enviant el missatge');
        this.isSending.set(false);
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  isOwnMessage(missatge: Missatge): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser?.usuari_id === missatge.usuari_id;
  }

  formatTime(timestamp: Date | string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(timestamp: Date | string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Avui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ahir';
    } else {
      return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' });
    }
  }

  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;

    const currentMissatge = this.missatges()[index];
    const previousMissatge = this.missatges()[index - 1];

    const currentDate = new Date(currentMissatge.timestamp).toDateString();
    const previousDate = new Date(previousMissatge.timestamp).toDateString();

    return currentDate !== previousDate;
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
