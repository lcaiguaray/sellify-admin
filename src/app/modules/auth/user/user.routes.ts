import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'users',
    title: 'Usuarios',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
