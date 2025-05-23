import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';
import { PersonService } from '../../../persons/services/person.service';
import { ListService } from '../../../lists/services/list.service';
import { Group, Person, PersonProfile } from '../../../../core/models';

@Component({
  selector: 'app-drawing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold">Générer des groupes</h1>
        <p class="text-base-content/70">Créez des groupes équilibrés à partir de votre liste</p>
      </div>

      <div class="divider"></div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Paramètres du tirage</h2>

          <form [formGroup]="drawingForm" (ngSubmit)="onSubmit()" class="space-y-4 mt-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nombre de groupes</span>
              </label>
              <input
                type="number"
                formControlName="numberOfGroups"
                class="input input-bordered w-full"
                [ngClass]="{'input-error': submitted && f['numberOfGroups'].errors}"
                min="2"
                [max]="persons.length"
              />
              <div *ngIf="submitted && f['numberOfGroups'].errors" class="text-error text-sm mt-1">
                <div *ngIf="f['numberOfGroups'].errors['required']">Le nombre de groupes est requis</div>
                <div *ngIf="f['numberOfGroups'].errors['min']">Il faut au moins 2 groupes</div>
                <div *ngIf="f['numberOfGroups'].errors['max']">Le nombre de groupes ne peut pas dépasser le nombre de personnes</div>
              </div>
            </div>

            <div class="divider">Critères de mixité</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    formControlName="mixAge"
                    class="checkbox checkbox-primary"
                  />
                  <span class="label-text">Mixer les âges</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    formControlName="mixNiveauTech"
                    class="checkbox checkbox-primary"
                  />
                  <span class="label-text">Mixer les niveaux techniques</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    formControlName="mixAncienDWWM"
                    class="checkbox checkbox-primary"
                  />
                  <span class="label-text">Mixer les anciens DWWM</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    formControlName="mixProfils"
                    class="checkbox checkbox-primary"
                  />
                  <span class="label-text">Mixer les profils</span>
                </label>
              </div>
            </div>

            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="loading || persons.length < 2"
              >
                <span *ngIf="loading" class="loading loading-spinner loading-sm"></span>
                Générer les groupes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Aperçu des groupes générés -->
      <div *ngIf="generatedGroups.length > 0" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Aperçu des groupes</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div *ngFor="let group of generatedGroups" class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title text-lg">{{ group.name }}</h3>
                <ul class="space-y-2">
                  <li *ngFor="let memberId of group.members" class="flex items-center gap-2">
                    <div class="avatar placeholder">
                      <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span>{{ getPersonInitials(memberId) }}</span>
                      </div>
                    </div>
                    <span>{{ getPersonName(memberId) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 gap-4">
            <button (click)="regenerateGroups()" class="btn btn-outline">
              Regénérer
            </button>
            <button (click)="saveDrawing()" class="btn btn-primary" [disabled]="savingDrawing">
              <span *ngIf="savingDrawing" class="loading loading-spinner loading-sm"></span>
              Enregistrer ce tirage
            </button>
          </div>
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
export class DrawingFormComponent implements OnInit {
  drawingForm: FormGroup;
  loading = false;
  savingDrawing = false;
  submitted = false;
  listId: string = '';
  persons: Person[] = [];
  generatedGroups: Group[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private drawingService: DrawingService,
    private personService: PersonService,
    private listService: ListService
  ) {
    this.drawingForm = this.formBuilder.group({
      numberOfGroups: [2, [Validators.required, Validators.min(2)]],
      mixAge: [true],
      mixNiveauTech: [true],
      mixAncienDWWM: [false],
      mixProfils: [true]
    });
  }

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId') || '';

    if (!this.listId) {
      this.router.navigate(['/lists']);
      return;
    }

    this.listService.getListById(this.listId).subscribe(list => {
      if (!list) {
        this.router.navigate(['/lists']);
      }
    });

    this.personService.getPersonsByListId(this.listId).subscribe(persons => {
      this.persons = persons;

      // Mettre à jour la validation du nombre de groupes
      const maxGroups = Math.max(2, this.persons.length);
      this.drawingForm.get('numberOfGroups')?.setValidators([
        Validators.required,
        Validators.min(2),
        Validators.max(maxGroups)
      ]);
      this.drawingForm.get('numberOfGroups')?.updateValueAndValidity();
    });
  }

  get f() { return this.drawingForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.drawingForm.invalid || this.persons.length < 2) {
      return;
    }

    this.loading = true;

    const { numberOfGroups, mixAge, mixNiveauTech, mixAncienDWWM, mixProfils } = this.drawingForm.value;

    try {
      this.generatedGroups = this.drawingService.generateGroups(
        this.persons,
        numberOfGroups,
        { mixAge, mixNiveauTech, mixAncienDWWM, mixProfils }
      );

      this.loading = false;
    } catch (error) {
      console.error('Error generating groups:', error);
      this.loading = false;
    }
  }

  regenerateGroups(): void {
    this.onSubmit();
  }

  saveDrawing(): void {
    if (this.generatedGroups.length === 0) {
      return;
    }

    this.savingDrawing = true;

    this.drawingService.createDrawing(this.listId, this.generatedGroups).subscribe({
      next: (drawing) => {
        this.router.navigate(['/lists', this.listId, 'drawings', drawing.id]);
      },
      error: (error) => {
        console.error('Error saving drawing:', error);
        this.savingDrawing = false;
      }
    });
  }

  getPersonName(personId: string): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? person.name : 'Inconnu';
  }

  getPersonInitials(personId: string): string {
    const person = this.persons.find(p => p.id === personId);
    if (!person) return '?';

    const nameParts = person.name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  }
}
