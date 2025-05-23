import { Routes } from '@angular/router';

export const DRAWINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/drawings-page/drawings-page.component')
        .then(m => m.DrawingsPageComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/drawing-form/drawing-form.component')
        .then(m => m.DrawingFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/drawing-detail/drawing-detail.component')
        .then(m => m.DrawingDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
