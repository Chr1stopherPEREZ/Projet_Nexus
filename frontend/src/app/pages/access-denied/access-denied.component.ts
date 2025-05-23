import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div class="text-error mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>

      <h1 class="text-4xl font-bold mb-4">Accès refusé</h1>
      <p class="text-xl mb-8 max-w-md">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>

      <div class="flex gap-4">
        <a routerLink="/dashboard" class="btn btn-primary">
          Retour au tableau de bord
        </a>
        <a routerLink="/auth/login" class="btn btn-outline">
          Se connecter avec un autre compte
        </a>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {}
