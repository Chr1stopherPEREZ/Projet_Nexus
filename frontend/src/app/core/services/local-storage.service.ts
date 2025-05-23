import { Injectable } from '@angular/core';

/**
 * Service pour gérer la persistance des données dans le LocalStorage
 * Utilisé comme solution temporaire avant la migration vers un backend
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly prefix = 'nexus_';

  constructor() { }

  /**
   * Enregistre une valeur dans le LocalStorage avec une clé préfixée
   * @param key Clé de stockage
   * @param value Valeur à stocker (sera convertie en JSON)
   */
  set<T>(key: string, value: T): void {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serializedValue);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement dans le LocalStorage:', error);
    }
  }

  /**
   * Récupère une valeur depuis le LocalStorage
   * @param key Clé de stockage
   * @param defaultValue Valeur par défaut si la clé n'existe pas
   * @returns La valeur stockée ou la valeur par défaut
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      const item = localStorage.getItem(prefixedKey);

      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Erreur lors de la récupération depuis le LocalStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Supprime une valeur du LocalStorage
   * @param key Clé de stockage
   */
  remove(key: string): void {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Erreur lors de la suppression depuis le LocalStorage:', error);
    }
  }

  /**
   * Vérifie si une clé existe dans le LocalStorage
   * @param key Clé de stockage
   * @returns true si la clé existe, false sinon
   */
  has(key: string): boolean {
    const prefixedKey = this.getKeyWithPrefix(key);
    return localStorage.getItem(prefixedKey) !== null;
  }

  /**
   * Efface toutes les données du LocalStorage liées à l'application
   */
  clear(): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Erreur lors du nettoyage du LocalStorage:', error);
    }
  }

  /**
   * Ajoute le préfixe de l'application à une clé
   * @param key Clé de base
   * @returns Clé avec préfixe
   */
  private getKeyWithPrefix(key: string): string {
    return `${this.prefix}${key}`;
  }
}
