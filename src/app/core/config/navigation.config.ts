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
    label: 'Catálogo',
    children: [
      {
        id: 'catalog.category',
        label: 'Categorías',
        route: '/admin/catalog/categories',
        icon: 'hugeFolder01',
      },
      {
        id: 'catalog.brand',
        label: 'Marcas',
        route: '/admin/catalog/brands',
        icon: 'coolShield',
      },
      {
        id: 'catalog.product',
        label: 'Productos',
        route: '/admin/catalog/products',
        icon: 'hugePackage',
      },
      {
        id: 'catalog.unit-measure',
        label: 'Unidades Base',
        route: '/admin/catalog/unit-measures',
        icon: 'hugeScale',
      },
      {
        id: 'catalog.unit-conversion',
        label: 'Conv. Unidades',
        route: '/admin/catalog/unit-conversions',
        icon: 'hugeExchange01',
      },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventario',
    children: [
      {
        id: 'inventory.items',
        label: 'Stock',
        route: '/admin/inventory/items',
        icon: 'hugeStore01',
      },
    ],
  },
  {
    id: 'crm',
    label: 'Directorio',
    children: [
      {
        id: 'crm.contacts',
        label: 'Contactos',
        route: '/admin/crm/contacts',
        icon: 'hugeUserGroup',
      },
    ],
  },
  {
    id: 'sales',
    label: 'Ventas',
    children: [
      {
        id: 'sales.list',
        label: 'Ventas',
        route: '/admin/sales',
        icon: 'hugeShoppingCart01',
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
