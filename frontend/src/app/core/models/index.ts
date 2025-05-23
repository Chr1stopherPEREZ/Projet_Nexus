/**
 * Modèles de données pour l'application Nexus
 * Basés sur le MCD défini dans le cahier des charges
 */

/**
 * Rôles utilisateur dans l'application
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  FORMATEUR = 'FORMATEUR',
  APPRENANT = 'APPRENANT'
}

/**
 * Profils possibles pour une personne
 */
export enum PersonProfile {
  AUDITIF = 'AUDITIF',
  VISUEL = 'VISUEL',
  KINESTHESIQUE = 'KINESTHESIQUE',
  ANALYTIQUE = 'ANALYTIQUE',
  COLLABORATIF = 'COLLABORATIF',
  LEADERSHIP = 'LEADERSHIP',
  CREATIF = 'CREATIF',
  AUTONOME = 'AUTONOME'
}

/**
 * Interface utilisateur
 */
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface liste de personnes
 */
export interface List {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface personne
 */
export interface Person {
  id: string;
  listId: string;
  name: string;
  genre: string;
  age: number;
  niveauTech: number; // 1-4
  profils: PersonProfile[];
  ancienDWWM: boolean;
  aisanceFr: number; // 1-4
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface groupe
 */
export interface Group {
  id: string;
  drawingId: string;
  name: string;
  members: string[]; // IDs des personnes
}

/**
 * Interface tirage
 */
export interface Drawing {
  id: string;
  listId: string;
  date: Date;
  groups: Group[];
}
