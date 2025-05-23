import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '../models';
import { LocalStorageService } from './local-storage.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service d'authentification simulé
 * Utilise le LocalStorage pour persister les données utilisateur
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'current_user';
  private readonly USERS_KEY = 'users';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    // Récupérer l'utilisateur courant depuis le LocalStorage au démarrage
    const storedUser = this.localStorage.get<User>(this.AUTH_KEY);
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  /**
   * Simule une connexion utilisateur
   * @param username Nom d'utilisateur
   * @param role Rôle de l'utilisateur (optionnel, par défaut APPRENANT)
   * @returns Observable avec l'utilisateur connecté
   */
  login(username: string, role: UserRole = UserRole.APPRENANT): Observable<User> {
    // Simuler un délai réseau
    return  of(null).pipe(
      delay(800),
      tap(() => {
        // Vérifier si l'utilisateur existe déjà
        const users = this.localStorage.get<User[] | null>(this.USERS_KEY, []) ?? [];
        let user = users.find(u => u.name.toLowerCase() === username.toLowerCase());

        if (!user) {
          // Créer un nouvel utilisateur
          user = {
            id: uuidv4(),
            name: username,
            role: role,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // Ajouter l'utilisateur à la liste
          this.localStorage.set(this.USERS_KEY, [...users, user]);
        }

        // Stocker l'utilisateur courant
        this.localStorage.set(this.AUTH_KEY, user);
        this.currentUserSubject.next(user);
      }),
      // Retourner l'utilisateur
      map(() => this.currentUserSubject.value!)
    );
  }

  /**
   * Déconnecte l'utilisateur courant
   */
  logout(): void {
    this.localStorage.remove(this.AUTH_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Vérifie si un utilisateur est connecté
   * @returns true si un utilisateur est connecté, false sinon
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Récupère l'utilisateur courant
   * @returns L'utilisateur courant ou null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie si l'utilisateur courant a un rôle spécifique
   * @param role Rôle à vérifier
   * @returns true si l'utilisateur a le rôle spécifié, false sinon
   */
  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === role;
  }

  /**
   * Vérifie si l'utilisateur courant a l'un des rôles spécifiés
   * @param roles Tableau de rôles à vérifier
   * @returns true si l'utilisateur a l'un des rôles spécifiés, false sinon
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.value;
    return !!user && roles.includes(user.role);
  }
}
