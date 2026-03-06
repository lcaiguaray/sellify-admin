import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
};
