import { Routes } from '@angular/router';

export const CATEGORY_ROUTES: Routes = [
  {
    path: 'categories',
    title: 'Categorías',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
