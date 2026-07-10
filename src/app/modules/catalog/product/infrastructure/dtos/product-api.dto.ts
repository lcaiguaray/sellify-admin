export interface ProductApiDto {
  id: string;
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
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
