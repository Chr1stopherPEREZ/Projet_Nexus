import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Drawing, Group, Person } from '../../../core/models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private readonly DRAWINGS_KEY = 'drawings';
  private drawingsSubject = new BehaviorSubject<Drawing[]>([]);
  public drawings$ = this.drawingsSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.loadDrawings();
  }

  private loadDrawings(): void {
    const drawings = this.localStorage.get<Drawing[]>(this.DRAWINGS_KEY, []) || [];
    this.drawingsSubject.next(drawings);
  }

  getDrawingsByListId(listId: string): Observable<Drawing[]> {
    return this.drawings$.pipe(
      map(drawings => drawings.filter(drawing => drawing.listId === listId))
    );
  }

  getDrawingById(id: string): Observable<Drawing | undefined> {
    return this.drawings$.pipe(
      map(drawings => drawings.find(drawing => drawing.id === id))
    );
  }

  createDrawing(listId: string, groups: Group[]): Observable<Drawing> {
    const newDrawing: Drawing = {
      id: uuidv4(),
      listId,
      date: new Date(),
      groups
    };

    const drawings = [...this.drawingsSubject.value, newDrawing];
    this.localStorage.set(this.DRAWINGS_KEY, drawings);
    this.drawingsSubject.next(drawings);

    return new Observable<Drawing>(subscriber => {
      subscriber.next(newDrawing);
      subscriber.complete();
    });
  }

  deleteDrawing(id: string): Observable<boolean> {
    const drawings = this.drawingsSubject.value;
    const filteredDrawings = drawings.filter(drawing => drawing.id !== id);

    if (filteredDrawings.length === drawings.length) {
      throw new Error(`Drawing with id ${id} not found`);
    }

    this.localStorage.set(this.DRAWINGS_KEY, filteredDrawings);
    this.drawingsSubject.next(filteredDrawings);

    return new Observable<boolean>(subscriber => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  getDrawingCount(listId: string): number {
    return this.drawingsSubject.value.filter(drawing => drawing.listId === listId).length;
  }

  // Algorithme de génération de groupes
  generateGroups(
    persons: Person[],
    numberOfGroups: number,
    criteria: {
      mixAge?: boolean,
      mixNiveauTech?: boolean,
      mixAncienDWWM?: boolean,
      mixProfils?: boolean
    }
  ): Group[] {
    if (persons.length === 0 || numberOfGroups <= 0 || numberOfGroups > persons.length) {
      throw new Error('Invalid parameters for group generation');
    }

    // Copie des personnes pour ne pas modifier l'original
    let shuffledPersons = [...persons];

    // Mélange initial aléatoire
    shuffledPersons = this.shuffleArray(shuffledPersons);

    // Appliquer les critères de mixité si demandé
    if (criteria.mixAge) {
      shuffledPersons.sort((a, b) => a.age - b.age);
    }

    if (criteria.mixNiveauTech) {
      shuffledPersons.sort((a, b) => a.niveauTech - b.niveauTech);
    }

    if (criteria.mixAncienDWWM) {
      shuffledPersons.sort((a, b) => (a.ancienDWWM === b.ancienDWWM) ? 0 : a.ancienDWWM ? 1 : -1);
    }

    if (criteria.mixProfils) {
      // Trier par nombre de profils
      shuffledPersons.sort((a, b) => a.profils.length - b.profils.length);
    }

    // Création des groupes vides
    const groups: Group[] = Array.from({ length: numberOfGroups }, (_, i) => ({
      id: uuidv4(),
      drawingId: '', // Sera défini lors de la création du tirage
      name: `Groupe ${i + 1}`,
      members: []
    }));

    // Distribution des personnes dans les groupes (méthode du serpent)
    let currentGroupIndex = 0;
    let direction = 1; // 1 pour aller vers l'avant, -1 pour aller vers l'arrière

    shuffledPersons.forEach(person => {
      groups[currentGroupIndex].members.push(person.id);

      // Changer de direction si on atteint le début ou la fin
      if (currentGroupIndex === 0 && direction === -1) {
        direction = 1;
      } else if (currentGroupIndex === numberOfGroups - 1 && direction === 1) {
        direction = -1;
      } else {
        currentGroupIndex += direction;
      }
    });

    return groups;
  }

  // Fonction utilitaire pour mélanger un tableau
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
