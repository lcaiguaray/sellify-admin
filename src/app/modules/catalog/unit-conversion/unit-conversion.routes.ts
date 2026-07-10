import { Routes } from '@angular/router';

export const UNIT_CONVERSION_ROUTES: Routes = [
  {
    path: 'unit-conversions',
    title: 'Conversiones de Unidades',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
