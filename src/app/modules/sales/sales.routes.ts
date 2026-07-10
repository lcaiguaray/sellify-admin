import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sale/presentation/pages/sale-list-page/sale-list-page').then((m) => m.default),
  },
  {
    path: 'new',
    loadComponent: () => import('./sale/presentation/pages/new-sale-page/new-sale-page').then((m) => m.default),
  },
];
