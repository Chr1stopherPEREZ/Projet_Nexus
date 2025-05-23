import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold">{{ isEditMode ? 'Modifier la liste' : 'Nouvelle liste' }}</h1>
        <p class="text-base-content/70">{{ isEditMode ? 'Modifiez les informations de votre liste' : 'Créez une nouvelle liste de personnes' }}</p>
      </div>

      <div class="divider"></div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form [formGroup]="listForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nom de la liste</span>
              </label>
              <input
                type="text"
                formControlName="name"
                class="input input-bordered w-full"
                [ngClass]="{'input-error': submitted && f['name'].errors}"
              />
              <div *ngIf="submitted && f['name'].errors" class="text-error text-sm mt-1">
                <div *ngIf="f['name'].errors['required']">Le nom de la liste est requis</div>
                <div *ngIf="f['name'].errors['minlength']">Le nom doit contenir au moins 3 caractères</div>
              </div>
            </div>

            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="loading"
              >
                <span *ngIf="loading" class="loading loading-spinner loading-sm"></span>
                {{ isEditMode ? 'Enregistrer les modifications' : 'Créer la liste' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex justify-end">
        <a routerLink="/lists" class="btn btn-outline">
          Retour aux listes
        </a>
      </div>
    </div>
  `
})
export class ListFormComponent implements OnInit {
  listForm: FormGroup;
  loading = false;
  submitted = false;
  isEditMode = false;
  listId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService
  ) {
    this.listForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.listId;

    if (this.isEditMode && this.listId) {
      this.listService.getListById(this.listId).subscribe(list => {
        if (list) {
          this.listForm.patchValue({
            name: list.name
          });
        } else {
          this.router.navigate(['/lists']);
        }
      });
    }
  }

  get f() { return this.listForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.listForm.invalid) {
      return;
    }

    this.loading = true;
    const { name } = this.listForm.value;

    if (this.isEditMode && this.listId) {
      this.listService.updateList(this.listId, name).subscribe({
        next: () => {
          this.router.navigate(['/lists']);
        },
        error: error => {
          console.error('Error updating list:', error);
          this.loading = false;
        }
      });
    } else {
      this.listService.createList(name).subscribe({
        next: () => {
          this.router.navigate(['/lists']);
        },
        error: error => {
          console.error('Error creating list:', error);
          this.loading = false;
        }
      });
    }
  }
}
