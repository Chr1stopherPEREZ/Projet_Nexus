import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';
import { ListService } from '../../../lists/services/list.service';
import { PersonService } from '../../../persons/services/person.service';
import { Drawing, Group, List, Person } from '../../../../core/models';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drawing-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">Détail du tirage</h1>
          <p class="text-base-content/70">Liste "{{ list?.name }}" - Tirage du {{ drawing?.date | date:'dd/MM/yyyy' }}</p>
        </div>
        <div class="flex gap-2">
          <button (click)="exportCSV()" class="btn btn-outline btn-info">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exporter CSV
          </button>
          <a [routerLink]="['/lists', listId, 'drawings', 'new']" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Nouveau tirage
          </a>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Chargement -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Erreur -->
      <div *ngIf="error" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <div>
          <h3 class="font-bold">Erreur</h3>
          <div class="text-sm">Impossible de charger les détails du tirage.</div>
        </div>
      </div>

      <!-- Contenu du tirage -->
      <div *ngIf="!loading && !error && drawing" class="space-y-6">
        <!-- Instructions drag & drop -->
        <div class="alert alert-info shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div>
            <h3 class="font-bold">Ajustement manuel</h3>
            <div class="text-sm">Vous pouvez glisser-déposer les personnes entre les groupes pour ajuster manuellement la répartition.</div>
          </div>
        </div>

        <!-- Groupes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let group of groups; let i = index" class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">{{ group.name }}</h3>

              <div
                cdkDropList
                [cdkDropListData]="group.members"
                [id]="'group-' + i"
                [cdkDropListConnectedTo]="getConnectedLists(i)"
                (cdkDropListDropped)="drop($event)"
                class="min-h-[100px] bg-base-200 rounded-box p-2"
              >
                <div
                  *ngFor="let memberId of group.members"
                  cdkDrag
                  class="bg-base-100 p-2 mb-2 rounded-box shadow-sm cursor-move"
                >
                  <div class="flex items-center gap-2">
                    <div class="avatar placeholder">
                      <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span>{{ getPersonInitials(memberId) }}</span>
                      </div>
                    </div>
                    <span>{{ getPersonName(memberId) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <button (click)="saveChanges()" class="btn btn-primary" [disabled]="saving">
            <span *ngIf="saving" class="loading loading-spinner loading-sm"></span>
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <div class="flex justify-between">
        <a [routerLink]="['/lists', listId, 'drawings']" class="btn btn-outline">
          Retour aux tirages
        </a>
        <a [routerLink]="['/lists', listId, 'persons']" class="btn btn-outline">
          Retour aux personnes
        </a>
      </div>
    </div>
  `
})
export class DrawingDetailComponent implements OnInit {
  listId: string = '';
  drawingId: string = '';
  drawing: Drawing | undefined;
  list: List | undefined;
  persons: Person[] = [];
  groups: Group[] = [];
  loading = true;
  saving = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private drawingService: DrawingService,
    private listService: ListService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.drawingId = this.route.snapshot.paramMap.get('id') || '';
    this.listId = this.route.snapshot.paramMap.get('listId') || '';

    if (!this.drawingId || !this.listId) {
      this.router.navigate(['/lists']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = false;

    // Charger la liste
    this.listService.getListById(this.listId).subscribe({
      next: (list) => {
        this.list = list;
        if (!list) {
          this.error = true;
          this.loading = false;
          return;
        }

        // Charger le tirage
        this.drawingService.getDrawingById(this.drawingId).subscribe({
          next: (drawing) => {
            this.drawing = drawing;
            if (!drawing) {
              this.error = true;
              this.loading = false;
              return;
            }

            // Copier les groupes pour pouvoir les modifier
            this.groups = JSON.parse(JSON.stringify(drawing.groups));

            // Charger les personnes
            this.personService.getPersonsByListId(this.listId).subscribe({
              next: (persons) => {
                this.persons = persons;
                this.loading = false;
              },
              error: () => {
                this.error = true;
                this.loading = false;
              }
            });
          },
          error: () => {
            this.error = true;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = true;
        this.loading = false;
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

  getConnectedLists(currentIndex: number): string[] {
    return Array.from({ length: this.groups.length }, (_, i) => `group-${i}`).filter(id => id !== `group-${currentIndex}`);
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  saveChanges(): void {
    if (!this.drawing) return;

    this.saving = true;

    // Créer un nouveau tirage avec les groupes modifiés
    this.drawingService.createDrawing(this.listId, this.groups).subscribe({
      next: (newDrawing) => {
        // Supprimer l'ancien tirage
        this.drawingService.deleteDrawing(this.drawingId).subscribe({
          next: () => {
            this.router.navigate(['/lists', this.listId, 'drawings', newDrawing.id]);
          },
          error: (error) => {
            console.error('Error deleting old drawing:', error);
            this.saving = false;
          }
        });
      },
      error: (error) => {
        console.error('Error saving changes:', error);
        this.saving = false;
      }
    });
  }

  exportCSV(): void {
    if (!this.drawing || !this.list) return;

    // Préparer les données CSV
    const headers = ['Groupe', 'Nom', 'Genre', 'Âge', 'Niveau Tech', 'Profils', 'Ancien DWWM', 'Aisance Fr'];
    const rows: string[][] = [];

    this.groups.forEach(group => {
      group.members.forEach(memberId => {
        const person = this.persons.find(p => p.id === memberId);
        if (person) {
          rows.push([
            group.name,
            person.name,
            person.genre,
            person.age.toString(),
            person.niveauTech.toString(),
            person.profils.join(', '),
            person.ancienDWWM ? 'Oui' : 'Non',
            person.aisanceFr.toString()
          ]);
        }
      });
    });

    // Générer le CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tirage_${this.list.name}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
