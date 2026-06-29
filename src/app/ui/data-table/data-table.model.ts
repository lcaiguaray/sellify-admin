import { TemplateRef } from '@angular/core';

export interface TableColumn<T> {
  key: Extract<keyof T, string> | (string & {});
  label: string;
  align?: 'left' | 'center' | 'right';
  truncate?: boolean; 
  tdClass?: string;
  customTemplate?: TemplateRef<{ $implicit: T }>;
}
