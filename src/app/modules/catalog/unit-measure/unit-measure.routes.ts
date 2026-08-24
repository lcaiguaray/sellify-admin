import { Routes } from '@angular/router';

export const UNIT_MEASURE_ROUTES: Routes = [
  {
    path: 'unit-measures',
    title: 'Unidades de Medida',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
