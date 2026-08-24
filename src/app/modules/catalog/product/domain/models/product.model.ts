import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export type ProductVariantAttribute = string | number | boolean | null;

export interface ProductVariantOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id?: string;
  sku: string;
  barcode?: string;
  name: string;
  costPrice: number;
  salePrice: number;
  attributes: Record<string, ProductVariantAttribute>;
  active?: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string | null;
  brandName?: string;
  unitMeasureId: string;
  unitMeasureName?: string;
  unitMeasureSymbol?: string;
  hasVariant: boolean;
  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];

  // Campos derivados que aún consumen los módulos de venta e inventario.
  barcode?: string;
  basePrice: number;
  cost?: number;
  initialStock: number;
}

export interface ProductSearchable extends Searchable {}

export const ProductSearchableDefault: ProductSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: null,
  sortBy: 'createdAt',
  sortDir: 'desc',
};

export interface CreateProduct {
  categoryId: string;
  brandId?: string | null;
  unitMeasureId: string;
  name: string;
  slug: string;
  description?: string;
  hasVariant: boolean;
  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];
}
