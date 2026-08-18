import { Routes } from '@angular/router';

export const CORE_ROUTES: Routes = [
  {
    path: 'lookup-groups',
    title: 'Catálogos del sistema',
    loadComponent: () => import('./lookup-group/presentation/pages/list-page/list-page'),
  },
  {
    path: 'lookup-groups/:lookupGroupId/values',
    title: 'Valores de catálogo',
    loadComponent: () => import('./lookup-value/presentation/pages/list-page/list-page'),
  },
];
