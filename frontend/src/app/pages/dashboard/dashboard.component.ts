import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Tableau de bord</h1>
          <p class="text-base-content/70">Bienvenue, {{ user?.name }}</p>
        </div>
        <div>
          <a routerLink="/lists/new" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Nouvelle liste
          </a>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </div>
          <div class="stat-title">Listes</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">Listes créées</div>
        </div>

        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-title">Personnes</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">Personnes enregistrées</div>
        </div>

        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="stat-title">Tirages</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">Tirages effectués</div>
        </div>
      </div>

      <!-- Contenu spécifique au rôle -->
      <div *ngIf="isAdmin" class="alert alert-info shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <div>
          <h3 class="font-bold">Mode Administrateur</h3>
          <div class="text-sm">Vous avez accès à toutes les fonctionnalités de l'application.</div>
        </div>
      </div>

      <div *ngIf="isFormateur" class="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div>
          <h3 class="font-bold">Mode Formateur</h3>
          <div class="text-sm">Vous pouvez créer et gérer des listes et des tirages.</div>
        </div>
      </div>

      <div *ngIf="isApprenant" class="alert alert-warning shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <div>
          <h3 class="font-bold">Mode Apprenant</h3>
          <div class="text-sm">Vous pouvez consulter vos affectations et votre historique.</div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Actions rapides</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <a routerLink="/lists" class="btn btn-outline btn-info">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              Voir mes listes
            </a>
            <a routerLink="/profile" class="btn btn-outline btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Mon profil
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  get isAdmin(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  get isFormateur(): boolean {
    return this.authService.hasRole(UserRole.FORMATEUR);
  }

  get isApprenant(): boolean {
    return this.authService.hasRole(UserRole.APPRENANT);
  }
}
