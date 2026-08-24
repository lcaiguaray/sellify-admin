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
        loadChildren: () =>
          import('@modules/catalog').then((m) => [
            ...m.BRAND_ROUTES,
            ...m.CATEGORY_ROUTES,
            ...m.UNIT_MEASURE_ROUTES,
            ...m.UNIT_CONVERSION_ROUTES,
            ...m.PRODUCT_ROUTES,
          ]),
      },
      {
        path: 'inventory',
        loadChildren: () => import('@modules/inventory').then((m) => m.INVENTORY_ITEM_ROUTES),
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.routes').then((m) => m.SALES_ROUTES),
      },
      {
        path: 'crm',
        loadChildren: () => import('./modules/crm/crm.routes').then((m) => m.CRM_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@modules/auth').then((m) => [...m.USER_ROUTES, ...m.ROLE_ROUTES]),
      },
      {
        path: 'core',
        loadChildren: () => import('@modules/core').then((m) => m.CORE_ROUTES),
      },
    ],
  },

  // 4. RUTA COMODÍN (Página 404)
  {
    path: '**',
    redirectTo: 'admin/analytics/dashboard',
  },
];
