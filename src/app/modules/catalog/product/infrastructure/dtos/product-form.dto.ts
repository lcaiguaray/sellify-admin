export interface ProductFormModel {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  unitMeasureId: string;
  brandId: string;
  hasVariant: boolean;
  sku: string;
  barcode: string;
  salePrice: number;
  costPrice: number;
}
