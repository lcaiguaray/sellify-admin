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
        id: 'general/academy',
        label: 'Academy',
        icon: 'iconify iconoir--graduation-cap',
      },
      {
        id: 'general/contacts',
        label: 'Contacts',
        icon: 'iconify tabler--address-book',
      },
      {
        id: 'general/file-manager',
        label: 'File Manager',
        icon: 'iconify tabler--file',
      },
      {
        id: 'general/help-center',
        label: 'Help Center',
        icon: 'iconify tabler--help',
      },
      {
        id: 'general/notes',
        label: 'Notes',
        icon: 'iconify tabler--note',
      },
      {
        id: 'general/tasks',
        label: 'Tasks',
        icon: 'iconify tabler--list',
        badge: '10',
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
      {
        id: 'extras/error',
        label: 'Error page',
        icon: 'iconify tabler--circle-x',
      },
      {
        id: 'extras/sign-in',
        label: 'Sign in',
        icon: 'iconify tabler--login',
      },
      {
        id: 'extras/sign-up',
        label: 'Sign up',
        icon: 'iconify tabler--logout',
      },
      {
        id: 'extras/forgot-password',
        label: 'Forgot password',
        icon: 'iconify tabler--lock-password',
      },
      {
        id: 'extras/reset-password',
        label: 'Reset password',
        icon: 'iconify tabler--lock-open',
      },
      {
        id: 'extras/coming-soon',
        label: 'Coming soon',
        icon: 'iconify tabler--traffic-cone',
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
      {
        id: 'documentation/getting-started/installation',
        label: 'Installation',
        icon: 'iconify tabler--download',
      },
      {
        id: 'documentation/getting-started/development',
        label: 'Development',
        icon: 'iconify tabler--code',
      },
      {
        id: 'documentation/getting-started/building',
        label: 'Building',
        icon: 'iconify tabler--blocks',
      },
    ],
  },
];
