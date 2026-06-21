import { NavigationItem } from "@core/shared-kernel/models/navigation-item.model";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    children: [
      {
        id: 'analytics.dashboard',
        label: 'Dashboard',
        route: '/admin/analytics/dashboard',
        icon: 'hugePieChart',
      },
    ],
  },
  {
    id: 'catalog',
    label: 'Catálago',
    children: [
      {
        id: 'catalog.brand',
        label: 'Marcas',
        route: '/admin/catalog/brands',
        icon: 'coolShield',
      },
    ],
  },
  {
    id: 'auth',
    label: 'Seguridad',
    children: [
      {
        id: 'auth.roles',
        label: 'Roles',
        route: '/admin/auth/roles',
        icon: 'coolShield',
      },
    ],
  },
];
