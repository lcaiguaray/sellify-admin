import { Routes } from '@angular/router';

export const ROLE_ROUTES: Routes = [
  {
    path: 'roles',
    title: 'Roles',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
