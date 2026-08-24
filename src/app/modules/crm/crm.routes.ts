import { Routes } from '@angular/router';

export const CRM_ROUTES: Routes = [
  {
    path: 'contacts',
    title: 'Directorio de Contactos',
    loadComponent: () => import('./contact/presentation/pages/list-page/list-page'),
  },
];
