export interface InventoryApiDto {
  id: string;
  productId: string;
  productName?: string;
  sku?: string;
  unitMeasureId: string;
  unitMeasureName?: string;
  quantity: number;
  minStock?: number;
  maxStock?: number;
  warehouseId?: string;
  warehouseName?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
