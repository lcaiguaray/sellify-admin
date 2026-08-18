import { NavigationItem } from '@core/shared-kernel/models/navigation-item.model';

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
        permissions: ['REPORT.READ'],
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
        permissions: ['CATEGORY.READ'],
      },
      {
        id: 'catalog.brand',
        label: 'Marcas',
        route: '/admin/catalog/brands',
        icon: 'coolShield',
        permissions: ['BRAND.READ'],
      },
      {
        id: 'catalog.product',
        label: 'Productos',
        route: '/admin/catalog/products',
        icon: 'hugePackage',
        permissions: ['PRODUCT.READ'],
      },
      {
        id: 'catalog.unit-measure',
        label: 'Unidades Base',
        route: '/admin/catalog/unit-measures',
        icon: 'hugeWeightScale',
        permissions: ['UOM.READ'],
      },
      {
        id: 'catalog.unit-conversion',
        label: 'Conv. Unidades',
        route: '/admin/catalog/unit-conversions',
        icon: 'hugeExchange01',
        permissions: ['UOM_CONVERSION.READ'],
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
        permissions: ['PRODUCT.READ'],
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
        permissions: ['CUSTOMER.READ'],
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
        permissions: ['ORDER.READ'],
      },
    ],
  },
  {
    id: 'auth',
    label: 'Seguridad',
    children: [
      {
        id: 'auth.users',
        label: 'Usuarios',
        route: '/admin/auth/users',
        icon: 'hugeUserGroup',
        permissions: ['USER.READ'],
      },
      {
        id: 'auth.roles',
        label: 'Roles',
        route: '/admin/auth/roles',
        icon: 'coolShield',
        permissions: ['ROLE.READ'],
      },
    ],
  },
  {
    id: 'core',
    label: 'Configuración',
    children: [
      {
        id: 'core.lookup-groups',
        label: 'Catálogos del sistema',
        route: '/admin/core/lookup-groups',
        icon: 'hugeDatabase01',
        permissions: ['LOOKUP_GROUP.READ'],
      },
    ],
  },
];
