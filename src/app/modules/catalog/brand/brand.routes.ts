import { Routes } from '@angular/router';

export const BRAND_ROUTES: Routes = [
  {
    path: 'brands',
    title: 'Marcas',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
