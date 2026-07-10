import { BaseEntity } from "@core/shared-kernel/models/base-entity.model";
import { Searchable } from "@core/shared-kernel/models/search-params.model";

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  description?: string;
  barcode?: string;
  categoryId: string;
  categoryName?: string;
  unitMeasureId: string;
  unitMeasureName?: string;
  basePrice: number;
  cost?: number;
  initialStock: number;
  brandId?: string;
  brandName?: string;
}

export interface ProductSearchable extends Searchable {}

export const ProductSearchableDefault: ProductSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: true,
  sortBy: 'createdAt',
  sortDir: 'desc',
};

export interface CreateProduct {
  name: string;
  sku: string;
  description?: string;
  barcode?: string;
  categoryId: string;
  unitMeasureId: string;
  basePrice: number;
  cost?: number;
  initialStock: number;
  brandId?: string;
}
