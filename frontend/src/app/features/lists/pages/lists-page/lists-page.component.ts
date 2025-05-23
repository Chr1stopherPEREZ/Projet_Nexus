import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListService } from '../../services/list.service';
import { PersonService } from '../../../persons/services/person.service';
import { DrawingService } from '../../../drawings/services/drawing.service';
import { List } from '../../../../core/models';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Mes listes</h1>
          <p class="text-base-content/70">Gérez vos listes de personnes</p>
        </div>
        <div>
          <button (click)="createNewList()" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Nouvelle liste
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Liste vide -->
      <div *ngIf="lists.length === 0" class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          <h2 class="text-2xl font-bold mt-4">Aucune liste</h2>
          <p class="text-base-content/70 mb-6">Vous n'avez pas encore créé de liste de personnes.</p>
          <button (click)="createNewList()" class="btn btn-primary">
            Créer ma première liste
          </button>
        </div>
      </div>

      <!-- Listes existantes -->
      <div *ngIf="lists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let list of lists" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{{ list.name }}</h2>
            <div class="flex items-center gap-2 text-sm text-base-content/70">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>{{ getPersonCount(list.id) }} personnes</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-base-content/70">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{{ getDrawingCount(list.id) }} tirages</span>
            </div>
            <div class="card-actions justify-end mt-4">
              <a [routerLink]="['/lists', list.id, 'persons']" class="btn btn-sm btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Personnes
              </a>
              <a [routerLink]="['/lists', list.id, 'drawings']" class="btn btn-sm btn-outline btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Tirages
              </a>
              <button (click)="editList(list)" class="btn btn-sm btn-outline btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button (click)="deleteList(list)" class="btn btn-sm btn-outline btn-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ListsPageComponent implements OnInit {
  lists: List[] = [];

  constructor(
    private listService: ListService,
    private personService: PersonService,
    private drawingService: DrawingService
  ) {}

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.listService.getLists().subscribe(lists => {
      this.lists = lists;
    });
  }

  getPersonCount(listId: string): number {
    return this.personService.getPersonCount(listId);
  }

  getDrawingCount(listId: string): number {
    return this.drawingService.getDrawingCount(listId);
  }

  createNewList(): void {
    const name = prompt('Nom de la nouvelle liste:');
    if (name) {
      this.listService.createList(name).subscribe(() => {
        this.loadLists();
      });
    }
  }

  editList(list: List): void {
    const newName = prompt('Nouveau nom de la liste:', list.name);
    if (newName && newName !== list.name) {
      this.listService.updateList(list.id, newName).subscribe(() => {
        this.loadLists();
      });
    }
  }

  deleteList(list: List): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la liste "${list.name}" ?`)) {
      this.listService.deleteList(list.id).subscribe(() => {
        this.loadLists();
      });
    }
  }
}
