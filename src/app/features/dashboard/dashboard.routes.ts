import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@layouts/admin-layout/admin-layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
      },
    ],
  },
];

export default routes;
