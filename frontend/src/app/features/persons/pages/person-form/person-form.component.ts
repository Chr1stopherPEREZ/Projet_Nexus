import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { ListService } from '../../../lists/services/list.service';
import { PersonProfile } from '../../../../core/models';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold">{{ isEditMode ? 'Modifier une personne' : 'Ajouter une personne' }}</h1>
        <p class="text-base-content/70">{{ isEditMode ? 'Modifiez les informations de cette personne' : 'Ajoutez une nouvelle personne à votre liste' }}</p>
      </div>

      <div class="divider"></div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form [formGroup]="personForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nom</span>
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
                <div *ngIf="f['name'].errors['maxlength']">Le nom ne doit pas dépasser 50 caractères</div>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Genre</span>
              </label>
              <input
                type="text"
                formControlName="genre"
                class="input input-bordered w-full"
                [ngClass]="{'input-error': submitted && f['genre'].errors}"
              />
              <div *ngIf="submitted && f['genre'].errors" class="text-error text-sm mt-1">
                <div *ngIf="f['genre'].errors['required']">Le genre est requis</div>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Âge</span>
              </label>
              <input
                type="number"
                formControlName="age"
                class="input input-bordered w-full"
                [ngClass]="{'input-error': submitted && f['age'].errors}"
              />
              <div *ngIf="submitted && f['age'].errors" class="text-error text-sm mt-1">
                <div *ngIf="f['age'].errors['required']">L'âge est requis</div>
                <div *ngIf="f['age'].errors['min']">L'âge minimum est 1</div>
                <div *ngIf="f['age'].errors['max']">L'âge maximum est 99</div>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Niveau technique (1-4)</span>
              </label>
              <input
                type="range"
                formControlName="niveauTech"
                min="1"
                max="4"
                class="range range-primary"
                step="1"
              />
              <div class="w-full flex justify-between text-xs px-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Profils</span>
              </label>
              <div class="grid grid-cols-2 gap-2">
                <div *ngFor="let profil of profilOptions">
                  <label class="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      [value]="profil"
                      (change)="onProfilChange($event)"
                      [checked]="isProfilSelected(profil)"
                      class="checkbox checkbox-primary"
                    />
                    <span class="label-text">{{ profil }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Ancien·ne DWWM</span>
                <input
                  type="checkbox"
                  formControlName="ancienDWWM"
                  class="toggle toggle-primary"
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Aisance en français (1-4)</span>
              </label>
              <input
                type="range"
                formControlName="aisanceFr"
                min="1"
                max="4"
                class="range range-primary"
                step="1"
              />
              <div class="w-full flex justify-between text-xs px-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>

            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="loading"
              >
                <span *ngIf="loading" class="loading loading-spinner loading-sm"></span>
                {{ isEditMode ? 'Enregistrer les modifications' : 'Ajouter la personne' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex justify-end">
        <a [routerLink]="['/lists', listId, 'persons']" class="btn btn-outline">
          Retour à la liste
        </a>
      </div>
    </div>
  `
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  loading = false;
  submitted = false;
  isEditMode = false;
  listId: string = '';
  personId: string | null = null;
  profilOptions = Object.values(PersonProfile);
  selectedProfils: PersonProfile[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private listService: ListService
  ) {
    this.personForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      genre: ['', [Validators.required]],
      age: [25, [Validators.required, Validators.min(1), Validators.max(99)]],
      niveauTech: [2, [Validators.required, Validators.min(1), Validators.max(4)]],
      ancienDWWM: [false],
      aisanceFr: [2, [Validators.required, Validators.min(1), Validators.max(4)]]
    });
  }

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId') || '';
    this.personId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.personId;

    if (!this.listId) {
      this.router.navigate(['/lists']);
      return;
    }

    this.listService.getListById(this.listId).subscribe(list => {
      if (!list) {
        this.router.navigate(['/lists']);
      }
    });

    if (this.isEditMode && this.personId) {
      this.personService.getPersonById(this.personId).subscribe(person => {
        if (person) {
          this.personForm.patchValue({
            name: person.name,
            genre: person.genre,
            age: person.age,
            niveauTech: person.niveauTech,
            ancienDWWM: person.ancienDWWM,
            aisanceFr: person.aisanceFr
          });
          this.selectedProfils = [...person.profils];
        } else {
          this.router.navigate(['/lists', this.listId, 'persons']);
        }
      });
    }
  }

  get f() { return this.personForm.controls; }

  onProfilChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const profil = checkbox.value as PersonProfile;

    if (checkbox.checked) {
      if (!this.selectedProfils.includes(profil)) {
        this.selectedProfils.push(profil);
      }
    } else {
      this.selectedProfils = this.selectedProfils.filter(p => p !== profil);
    }
  }

  isProfilSelected(profil: PersonProfile): boolean {
    return this.selectedProfils.includes(profil);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.personForm.invalid) {
      return;
    }

    this.loading = true;
    const personData = {
      ...this.personForm.value,
      profils: this.selectedProfils,
      listId: this.listId
    };

    if (this.isEditMode && this.personId) {
      this.personService.updatePerson(this.personId, personData).subscribe({
        next: () => {
          this.router.navigate(['/lists', this.listId, 'persons']);
        },
        error: error => {
          console.error('Error updating person:', error);
          this.loading = false;
        }
      });
    } else {
      this.personService.createPerson(personData).subscribe({
        next: () => {
          this.router.navigate(['/lists', this.listId, 'persons']);
        },
        error: error => {
          console.error('Error creating person:', error);
          this.loading = false;
        }
      });
    }
  }
}
