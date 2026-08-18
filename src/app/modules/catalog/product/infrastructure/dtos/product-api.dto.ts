import { ProductVariantAttribute } from '../../domain/models/product.model';

export interface ProductVariantOptionApiDto {
  name: string;
  values: string[];
}

export interface ProductVariantApiDto {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  costPrice: number;
  salePrice: number;
  attributes: Record<string, ProductVariantAttribute>;
  active: boolean;
}

export interface ProductApiDto {
  category: {
    id: string;
    name: string;
    slug: string;
    active: boolean;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
    active: boolean;
  } | null;
  uom: {
    id: string;
    code: string;
    name: string;
    symbol: string;
    active: boolean;
  };
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  hasVariant: boolean;
  active: boolean;
  variantOptions?: ProductVariantOptionApiDto[] | null;
  variants: ProductVariantApiDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequestApiDto {
  categoryId: string;
  brandId: string | null;
  uomId: string;
  name: string;
  slug: string;
  description: string | null;
  hasVariant: boolean;
  variantOptions: ProductVariantOptionApiDto[];
  variants: Array<{
    id: string | null;
    sku: string;
    name: string;
    barcode: string | null;
    salePrice: number;
    costPrice: number;
    attributes: Record<string, ProductVariantAttribute>;
  }>;
}
