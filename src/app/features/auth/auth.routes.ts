import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@layouts/empty-layout/empty-layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/login/login'),
      },
    ],
  },
];

export default routes;
