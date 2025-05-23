import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Person, PersonProfile } from '../../../core/models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly PERSONS_KEY = 'persons';
  private personsSubject = new BehaviorSubject<Person[]>([]);
  public persons$ = this.personsSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.loadPersons();
  }

  private loadPersons(): void {
    const persons = this.localStorage.get<Person[]>(this.PERSONS_KEY, []) || [];
    this.personsSubject.next(persons);
  }

  getPersonsByListId(listId: string): Observable<Person[]> {
    return this.persons$.pipe(
      map(persons => persons.filter(person => person.listId === listId))
    );
  }

  getPersonById(id: string): Observable<Person | undefined> {
    return this.persons$.pipe(
      map(persons => persons.find(person => person.id === id))
    );
  }

  createPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Observable<Person> {
    const newPerson: Person = {
      id: uuidv4(),
      ...person,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const persons = [...this.personsSubject.value, newPerson];
    this.localStorage.set(this.PERSONS_KEY, persons);
    this.personsSubject.next(persons);

    return new Observable<Person>(subscriber => {
      subscriber.next(newPerson);
      subscriber.complete();
    });
  }

  updatePerson(id: string, personData: Partial<Omit<Person, 'id' | 'listId' | 'createdAt' | 'updatedAt'>>): Observable<Person> {
    const persons = this.personsSubject.value;
    const index = persons.findIndex(person => person.id === id);

    if (index === -1) {
      throw new Error(`Person with id ${id} not found`);
    }

    const updatedPerson = {
      ...persons[index],
      ...personData,
      updatedAt: new Date()
    };

    persons[index] = updatedPerson;
    this.localStorage.set(this.PERSONS_KEY, persons);
    this.personsSubject.next([...persons]);

    return new Observable<Person>(subscriber => {
      subscriber.next(updatedPerson);
      subscriber.complete();
    });
  }

  deletePerson(id: string): Observable<boolean> {
    const persons = this.personsSubject.value;
    const filteredPersons = persons.filter(person => person.id !== id);

    if (filteredPersons.length === persons.length) {
      throw new Error(`Person with id ${id} not found`);
    }

    this.localStorage.set(this.PERSONS_KEY, filteredPersons);
    this.personsSubject.next(filteredPersons);

    return new Observable<boolean>(subscriber => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  getPersonCount(listId: string): number {
    return this.personsSubject.value.filter(person => person.listId === listId).length;
  }
}
