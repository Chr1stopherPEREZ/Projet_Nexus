import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UserRole } from './core/models';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'lists',
        loadChildren: () => import('./features/lists/lists.routes').then(m => m.LISTS_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: [UserRole.ADMIN, UserRole.FORMATEUR] }
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'access-denied',
        loadComponent: () => import('./pages/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
