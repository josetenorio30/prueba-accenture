import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/tasks.page').then((m) => m.TasksPage),
  },
  // ⚡ PROTECCIÓN DE RUTAS (WILDCARD)
  // Cualquier ruta que no coincida con las de arriba (ej. /categories) será redirigida a 'tasks'
  {
    path: '**',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];