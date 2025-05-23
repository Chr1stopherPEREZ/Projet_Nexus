import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { ListService } from '../../../lists/services/list.service';
import { Person, List, PersonProfile } from '../../../../core/models';

@Component({
  selector: 'app-persons-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Personnes de la liste "{{ list?.name }}"</h1>
          <p class="text-base-content/70">Gérez les personnes de cette liste</p>
        </div>
        <div>
          <a [routerLink]="['/lists', listId, 'persons', 'new']" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Ajouter une personne
          </a>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Liste vide -->
      <div *ngIf="persons.length === 0" class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <h2 class="text-2xl font-bold mt-4">Aucune personne</h2>
          <p class="text-base-content/70 mb-6">Cette liste ne contient pas encore de personnes.</p>
          <a [routerLink]="['/lists', listId, 'persons', 'new']" class="btn btn-primary">
            Ajouter ma première personne
          </a>
        </div>
      </div>

      <!-- Tableau des personnes -->
      <div *ngIf="persons.length > 0" class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Genre</th>
              <th>Âge</th>
              <th>Niveau</th>
              <th>Profils</th>
              <th>Ancien DWWM</th>
              <th>Aisance Fr</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let person of persons">
              <td>{{ person.name }}</td>
              <td>{{ person.genre }}</td>
              <td>{{ person.age }}</td>
              <td>{{ person.niveauTech }}/4</td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span *ngFor="let profil of person.profils" class="badge badge-sm">{{ profil }}</span>
                </div>
              </td>
              <td>{{ person.ancienDWWM ? 'Oui' : 'Non' }}</td>
              <td>{{ person.aisanceFr }}/4</td>
              <td>
                <div class="flex gap-2">
                  <button (click)="editPerson(person)" class="btn btn-xs btn-outline btn-info">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button (click)="deletePerson(person)" class="btn btn-xs btn-outline btn-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between">
        <a routerLink="/lists" class="btn btn-outline">
          Retour aux listes
        </a>
        <a *ngIf="persons.length > 0" [routerLink]="['/lists', listId, 'drawings', 'new']" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Générer des groupes
        </a>
      </div>
    </div>
  `
})
export class PersonsPageComponent implements OnInit {
  listId: string = '';
  list: List | undefined;
  persons: Person[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private listService: ListService
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

    this.personService.getPersonsByListId(this.listId).subscribe(persons => {
      this.persons = persons;
    });
  }

  editPerson(person: Person): void {
    this.router.navigate(['/lists', this.listId, 'persons', person.id, 'edit']);
  }

  deletePerson(person: Person): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${person.name}" ?`)) {
      this.personService.deletePerson(person.id).subscribe(() => {
        this.persons = this.persons.filter(p => p.id !== person.id);
      });
    }
  }
}
