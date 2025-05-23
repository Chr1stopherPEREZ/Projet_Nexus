import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold">Connexion</h2>
      <p class="text-sm opacity-70">Entrez votre nom pour continuer</p>
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Nom d'utilisateur</span>
        </label>
        <input
          type="text"
          formControlName="username"
          class="input input-bordered w-full"
          [ngClass]="{'input-error': submitted && f['username'].errors}"
        />
        <div *ngIf="submitted && f['username'].errors" class="text-error text-sm mt-1">
          <div *ngIf="f['username'].errors['required']">Le nom d'utilisateur est requis</div>
          <div *ngIf="f['username'].errors['minlength']">Le nom doit contenir au moins 3 caractères</div>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Rôle (pour simulation)</span>
        </label>
        <select formControlName="role" class="select select-bordered w-full">
          <option [value]="UserRole.ADMIN">Administrateur</option>
          <option [value]="UserRole.FORMATEUR">Formateur</option>
          <option [value]="UserRole.APPRENANT">Apprenant</option>
        </select>
      </div>

      <div class="form-control mt-6">
        <button
          type="submit"
          class="btn btn-primary w-full"
          [disabled]="loading"
        >
          <span *ngIf="loading" class="loading loading-spinner loading-sm"></span>
          Connexion
        </button>
      </div>
    </form>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/dashboard';
  UserRole = UserRole; // Pour utiliser l'enum dans le template

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Rediriger vers le tableau de bord si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      role: [UserRole.APPRENANT]
    });

    // Récupérer l'URL de retour des query params ou utiliser la valeur par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Arrêter si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, role } = this.loginForm.value;

    this.authService.login(username, role)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          console.error('Erreur de connexion:', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
