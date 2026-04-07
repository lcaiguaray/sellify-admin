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
      {
        path: 'caja',
        loadComponent: () => import('./modules/caja/inicio/caja.component'),
      },
      {
        path: 'caja/crear',
        loadComponent: () => import('./modules/caja/crear/crear.component'),
      },
      {
        path: 'producto',
        loadComponent: () => import('./modules/producto/inicio/producto.component'),
      },
      {
        path: 'transferencia',
        loadComponent: () => import('./modules/transferencia/inicio/transferencia.component'),
      }
    ],
  },
];

export default routes;
