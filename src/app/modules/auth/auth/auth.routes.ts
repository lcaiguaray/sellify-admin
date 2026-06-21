import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./presentation/pages/login-page/login-page'),
  },
];
