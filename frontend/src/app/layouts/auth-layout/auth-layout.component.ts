import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-base-200 flex flex-col justify-center items-center">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary">Projet Nexus</h1>
        <p class="text-base-content opacity-70">Gestion de groupes d'apprenants</p>
      </div>

      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <router-outlet></router-outlet>
        </div>
      </div>

      <footer class="mt-8 text-center text-base-content opacity-70">
        <p>Copyright © 2025 | Projet Nexus | Christopher PEREZ</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AuthLayoutComponent {
  constructor() {}
}
