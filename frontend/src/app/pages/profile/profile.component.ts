import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold">Mon profil</h1>
        <p class="text-base-content/70">Gérez vos informations personnelles</p>
      </div>

      <div class="divider"></div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Informations utilisateur -->
        <div class="md:col-span-2">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Informations personnelles</h2>

              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4 mt-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom d'utilisateur</span>
                  </label>
                  <input
                    type="text"
                    formControlName="name"
                    class="input input-bordered w-full"
                    [ngClass]="{'input-error': submitted && f['name'].errors}"
                  />
                  <div *ngIf="submitted && f['name'].errors" class="text-error text-sm mt-1">
                    <div *ngIf="f['name'].errors['required']">Le nom est requis</div>
                    <div *ngIf="f['name'].errors['minlength']">Le nom doit contenir au moins 3 caractères</div>
                  </div>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">URL de l'avatar</span>
                  </label>
                  <input
                    type="text"
                    formControlName="avatarUrl"
                    class="input input-bordered w-full"
                  />
                  <label class="label">
                    <span class="label-text-alt">Laissez vide pour utiliser un avatar généré automatiquement</span>
                  </label>
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
                    class="btn btn-primary"
                    [disabled]="loading"
                  >
                    <span *ngIf="loading" class="loading loading-spinner loading-sm"></span>
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Carte utilisateur -->
        <div>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body items-center text-center">
              <div class="avatar">
                <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img [src]="avatarUrl" alt="Avatar" />
                </div>
              </div>
              <h2 class="card-title mt-4">{{ user?.name }}</h2>
              <p class="badge badge-primary">{{ roleLabel }}</p>
              <div class="card-actions mt-4">
                <button class="btn btn-outline btn-error" (click)="logout()">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl mt-6">
            <div class="card-body">
              <h3 class="font-bold">Informations du compte</h3>
              <div class="text-sm space-y-2">
                <p><span class="font-semibold">Créé le:</span> {{ user?.createdAt | date:'dd/MM/yyyy' }}</p>
                <p><span class="font-semibold">Dernière mise à jour:</span> {{ user?.updatedAt | date:'dd/MM/yyyy' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  loading = false;
  submitted = false;
  UserRole = UserRole; // Pour utiliser l'enum dans le template

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      avatarUrl: [''],
      role: [UserRole.APPRENANT]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        avatarUrl: this.user.avatarUrl || '',
        role: this.user.role
      });
    }
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() { return this.profileForm.controls; }

  get avatarUrl(): string {
    const url = this.profileForm.get('avatarUrl')?.value;
    if (url) return url;
    return `https://ui-avatars.com/api/?name=${this.user?.name || 'User'}&background=random`;
  }

  get roleLabel(): string {
    switch (this.user?.role) {
      case UserRole.ADMIN: return 'Administrateur';
      case UserRole.FORMATEUR: return 'Formateur';
      case UserRole.APPRENANT: return 'Apprenant';
      default: return 'Utilisateur';
    }
  }

  onSubmit() {
    this.submitted = true;

    // Arrêter si le formulaire est invalide
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    // Simuler une mise à jour du profil
    setTimeout(() => {
      if (this.user) {
        const updatedUser: User = {
          ...this.user,
          name: this.profileForm.value.name,
          avatarUrl: this.profileForm.value.avatarUrl || undefined,
          role: this.profileForm.value.role,
          updatedAt: new Date()
        };

        // Mettre à jour l'utilisateur dans le service d'authentification
        // Note: Dans une implémentation réelle, cela serait fait via un appel API
        this.authService.logout();
        this.authService.login(updatedUser.name, updatedUser.role).subscribe();

        this.loading = false;
      }
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
  }
}
