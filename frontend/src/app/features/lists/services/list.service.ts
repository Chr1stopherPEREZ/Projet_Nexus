import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { List } from '../../../core/models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly LISTS_KEY = 'lists';
  private listsSubject = new BehaviorSubject<List[]>([]);
  public lists$ = this.listsSubject.asObservable();

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService
  ) {
    this.loadLists();
  }

  private loadLists(): void {
    const lists = this.localStorage.get<List[]>(this.LISTS_KEY, []) || [];
    this.listsSubject.next(lists);
  }

  getLists(): Observable<List[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return new Observable<List[]>(subscriber => subscriber.next([]));

    return this.lists$.pipe(
      map(lists => lists.filter(list => list.ownerId === currentUser.id))
    );
  }

  getListById(id: string): Observable<List | undefined> {
    return this.lists$.pipe(
      map(lists => lists.find(list => list.id === id))
    );
  }

  createList(name: string): Observable<List> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to create a list');
    }

    const newList: List = {
      id: uuidv4(),
      name,
      ownerId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const lists = [...this.listsSubject.value, newList];
    this.localStorage.set(this.LISTS_KEY, lists);
    this.listsSubject.next(lists);

    return new Observable<List>(subscriber => {
      subscriber.next(newList);
      subscriber.complete();
    });
  }

  updateList(id: string, name: string): Observable<List> {
    const lists = this.listsSubject.value;
    const index = lists.findIndex(list => list.id === id);

    if (index === -1) {
      throw new Error(`List with id ${id} not found`);
    }

    const updatedList = {
      ...lists[index],
      name,
      updatedAt: new Date()
    };

    lists[index] = updatedList;
    this.localStorage.set(this.LISTS_KEY, lists);
    this.listsSubject.next([...lists]);

    return new Observable<List>(subscriber => {
      subscriber.next(updatedList);
      subscriber.complete();
    });
  }

  deleteList(id: string): Observable<boolean> {
    const lists = this.listsSubject.value;
    const filteredLists = lists.filter(list => list.id !== id);

    if (filteredLists.length === lists.length) {
      throw new Error(`List with id ${id} not found`);
    }

    this.localStorage.set(this.LISTS_KEY, filteredLists);
    this.listsSubject.next(filteredLists);

    return new Observable<boolean>(subscriber => {
      subscriber.next(true);
      subscriber.complete();
    });
  }
}
