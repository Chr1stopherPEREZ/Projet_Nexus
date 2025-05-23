import { Routes } from '@angular/router';

export const LISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/lists-page/lists-page.component').then(m => m.ListsPageComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/list-form/list-form.component').then(m => m.ListFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/list-form/list-form.component').then(m => m.ListFormComponent)
  },
  {
    path: ':id/persons',
    loadChildren: () => import('../persons/persons.routes').then(m => m.PERSONS_ROUTES)
  },
  {
    path: ':id/drawings',
    loadChildren: () => import('../drawings/drawings.routes').then(m => m.DRAWINGS_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
