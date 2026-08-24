import { Routes } from '@angular/router';

export const INVENTORY_ITEM_ROUTES: Routes = [
  {
    path: 'items',
    title: 'Inventario',
    loadComponent: () => import('./presentation/pages/list-page/list-page'),
  },
];
