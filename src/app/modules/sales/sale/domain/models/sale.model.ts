import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subtotal: number;
}

export interface Sale extends BaseEntity {
  clientId?: string;
  clientName: string; // 'Cliente Varios' if not selected
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  items: SaleItem[];
}

export interface SaleSearchable extends Searchable {
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export const SaleSearchableDefault: SaleSearchable = {
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortDir: 'desc',
  search: '',
  active: null,
};

export interface CreateSale {
  clientId?: string;
  clientName: string;
  subtotal: number;
  tax: number;
  total: number;
  items: Omit<SaleItem, 'subtotal'>[];
}

export interface PausedSale {
  id: string; // unique timestamp or uuid
  clientName: string;
  items: SaleItem[];
  createdAt: Date;
}
