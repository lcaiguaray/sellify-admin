import { Routes } from '@angular/router';
import DashboardLayout from '@layouts/dashboard-layout/dashboard-layout';
import { authGuard } from '@modules/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/analytics/dashboard',
    pathMatch: 'full',
  },

  // 2. ZONA PÚBLICA / SEGURIDAD (Sin sesión)
  {
    path: 'auth',
    loadChildren: () => import('@modules/auth/index').then((m) => m.AUTH_ROUTES),
  },

  // 3. ZONA PRIVADA (Con sesión)
  {
    path: 'admin',
    component: DashboardLayout, // <-- Inyectamos el cascarón del ERP
    canActivate: [authGuard],
    children: [
      // Usamos 'children' en lugar de 'loadChildren' directo,
      // para poder meter más de un módulo bajo el DashboardLayout en el futuro.
      {
        path: 'analytics',
        loadChildren: () => import('@modules/analytics').then((m) => m.ANALYTICS_ROUTES),
      },
      {
        path: 'catalog',
        loadChildren: () => import('@modules/catalog').then((m) => m.BRAND_ROUTES),
      },
      // {
      //   path: 'inventory',
      //   loadChildren: () => import('@modules/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
      // }
    ],
  },

  // 4. RUTA COMODÍN (Página 404)
  {
    path: '**',
    redirectTo: 'admin/analytics/dashboard',
  },
];
