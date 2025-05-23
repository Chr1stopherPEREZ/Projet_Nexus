import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';
import { ListService } from '../../../lists/services/list.service';
import { PersonService } from '../../../persons/services/person.service';
import { Drawing, List, Person } from '../../../../core/models';

@Component({
  selector: 'app-drawings-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Tirages de la liste "{{ list?.name }}"</h1>
          <p class="text-base-content/70">Historique des groupes générés</p>
        </div>
        <div>
          <a [routerLink]="['/lists', listId, 'drawings', 'new']" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Nouveau tirage
          </a>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Liste vide -->
      <div *ngIf="drawings.length === 0" class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h2 class="text-2xl font-bold mt-4">Aucun tirage</h2>
          <p class="text-base-content/70 mb-6">Vous n'avez pas encore généré de groupes pour cette liste.</p>
          <a [routerLink]="['/lists', listId, 'drawings', 'new']" class="btn btn-primary">
            Créer mon premier tirage
          </a>
        </div>
      </div>

      <!-- Liste des tirages -->
      <div *ngIf="drawings.length > 0" class="space-y-6">
        <div *ngFor="let drawing of drawings" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 class="card-title">Tirage du {{ drawing.date | date:'dd/MM/yyyy' }}</h2>
                <p class="text-base-content/70">{{ drawing.groups.length }} groupes</p>
              </div>
              <div class="flex gap-2 mt-4 md:mt-0">
                <a [routerLink]="['/lists', listId, 'drawings', drawing.id]" class="btn btn-sm btn-outline btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  Voir
                </a>
                <button (click)="deleteDrawing(drawing)" class="btn btn-sm btn-outline btn-error">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>

            <div class="divider"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let group of drawing.groups" class="card bg-base-200">
                <div class="card-body p-4">
                  <h3 class="card-title text-lg">{{ group.name }}</h3>
                  <ul class="space-y-1">
                    <li *ngFor="let memberId of group.members" class="text-sm">
                      {{ getPersonName(memberId) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <a [routerLink]="['/lists', listId, 'persons']" class="btn btn-outline">
          Retour aux personnes
        </a>
      </div>
    </div>
  `
})
export class DrawingsPageComponent implements OnInit {
  listId: string = '';
  list: List | undefined;
  drawings: Drawing[] = [];
  persons: Person[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private drawingService: DrawingService,
    private listService: ListService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId') || '';

    if (!this.listId) {
      this.router.navigate(['/lists']);
      return;
    }

    this.listService.getListById(this.listId).subscribe(list => {
      this.list = list;
      if (!list) {
        this.router.navigate(['/lists']);
      }
    });

    this.drawingService.getDrawingsByListId(this.listId).subscribe(drawings => {
      this.drawings = drawings;
    });

    this.personService.getPersonsByListId(this.listId).subscribe(persons => {
      this.persons = persons;
    });
  }

  getPersonName(personId: string): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? person.name : 'Inconnu';
  }

  deleteDrawing(drawing: Drawing): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce tirage ?`)) {
      this.drawingService.deleteDrawing(drawing.id).subscribe(() => {
        this.drawings = this.drawings.filter(d => d.id !== drawing.id);
      });
    }
  }
}
