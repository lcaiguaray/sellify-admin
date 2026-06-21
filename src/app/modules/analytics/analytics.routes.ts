import { Routes } from '@angular/router';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./presentation/pages/dashboard-page/dashboard-page'),
  },
];
