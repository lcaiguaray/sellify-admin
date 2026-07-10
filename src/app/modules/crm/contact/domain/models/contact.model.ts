import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASAPORTE' | 'OTROS';

export interface Contact extends BaseEntity {
  documentType: DocumentType;
  documentNumber: string;
  name: string; // Nombres o Razón Social
  email?: string;
  phone?: string;
  address?: string;
  isCustomer: boolean;
  isProvider: boolean;
  isEmployee: boolean;
}

export interface ContactSearchable extends Searchable {
  role?: 'all' | 'customer' | 'provider' | 'employee';
}

export const ContactSearchableDefault: ContactSearchable = {
  page: 0,
  size: 10,
  sortBy: 'name',
  sortDir: 'asc',
  search: '',
  active: null,
  role: 'all',
};

export interface CreateContact {
  documentType: DocumentType;
  documentNumber: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isCustomer: boolean;
  isProvider: boolean;
  isEmployee: boolean;
}
