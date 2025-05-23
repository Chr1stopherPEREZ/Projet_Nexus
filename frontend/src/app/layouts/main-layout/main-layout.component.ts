import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-base-100 flex flex-col">
      <!-- Header -->
      <header class="navbar bg-primary text-primary-content shadow-lg">
        <div class="navbar-start">
          <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a routerLink="/dashboard">Tableau de bord</a></li>
              <li><a routerLink="/lists">Listes</a></li>
              <li><a routerLink="/profile">Profil</a></li>
            </ul>
          </div>
          <a routerLink="/" class="btn btn-ghost normal-case text-xl">Projet Nexus</a>
        </div>
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            <li><a routerLink="/dashboard">Tableau de bord</a></li>
            <li><a routerLink="/lists">Listes</a></li>
            <li><a routerLink="/profile">Profil</a></li>
          </ul>
        </div>
        <div class="navbar-end">
          <div class="dropdown dropdown-end" *ngIf="currentUser">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img [src]="currentUser.avatarUrl || 'https://ui-avatars.com/api/?name=' + currentUser.name" alt="Avatar" />
              </div>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a routerLink="/profile" class="justify-between">
                  Profil
                </a>
              </li>
              <li><a (click)="logout()">Déconnexion</a></li>
            </ul>
          </div>
          <a *ngIf="!currentUser" routerLink="/auth/login" class="btn btn-ghost">Connexion</a>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © 2025 - Projet Nexus</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MainLayoutComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
