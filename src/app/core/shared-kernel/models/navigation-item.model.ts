import { IsActiveMatchOptions } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  description?: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  permissions?: string[];
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
}
