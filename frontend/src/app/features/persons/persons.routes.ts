import { Routes } from '@angular/router';

export const PERSONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/persons-page/persons-page.component').then(m => m.PersonsPageComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/person-form/person-form.component').then(m => m.PersonFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/person-form/person-form.component').then(m => m.PersonFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
