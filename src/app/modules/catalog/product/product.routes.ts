import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: 'products',
    title: 'Productos',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
