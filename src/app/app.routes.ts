import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'gastos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/gastos/gastos-list.component').then((m) => m.GastosListComponent),
  },
  {
    path: 'gastos/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/gastos/gastos-form/gasto-form.component').then((m) => m.GastoFormComponent),
  },
  {
    path: 'gastos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/gastos/gastos-form/gasto-form.component').then((m) => m.GastoFormComponent),
  },
  {
    path: 'reglas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reglas/reglas.component').then((m) => m.ReglasComponent),
  },
  {
    path: 'importar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/importar/importar.component').then((m) => m.ImportarComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
