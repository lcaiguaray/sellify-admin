import { Routes } from '@angular/router';

export const routes: Routes = [
  // Auth
  {
    path: '',
    loadChildren: () => import('@features/auth/auth.routes'),
  },

  // Admin
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadChildren: () => import('@features/dashboard/dashboard.routes'),
      },
    ],
  },
];
