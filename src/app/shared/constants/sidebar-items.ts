import { NavigationItem } from '@app/core/models/navigation';

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    children: [
      {
        id: 'admin',
        label: 'Inicio',
        icon: 'iconify tabler--layout-dashboard',
        route: '/admin',
      },
      {
        id: 'dashboards/analytics',
        label: 'Analytics',
        icon: 'iconify tabler--chart-dots-filled',
      }
    ],
  },
  {
    id: 'general',
    label: 'General',
    children: [
      {
        id: 'caja',
        label: 'Caja',
        icon: 'iconify iconoir--graduation-cap',
        route: '/admin/caja'
      },
      {
        id: 'producto',
        label: 'Almacen',
        icon: 'iconify iconoir--graduation-cap',
        route: '/admin/producto'
      },
      {
        id: 'persona',
        label: 'Persona',
        icon: 'iconify iconoir--graduation-cap',
        route: '/admin/persona'
      },
      {
        id: 'transferencia',
        label: 'Transferencia',
        icon: 'iconify iconoir--graduation-cap',
        route: '/admin/transferencia'
      },
      
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    children: [
      {
        id: 'extras/settings',
        label: 'Settings',
        icon: 'iconify tabler--settings',
      },
      
    ],
  },
  {
    id: 'documentation',
    label: 'Documentation',
    children: [
      {
        id: 'documentation/changelog',
        label: 'Changelog',
        icon: 'iconify tabler--logs',
      },
      
    ],
  },
];
