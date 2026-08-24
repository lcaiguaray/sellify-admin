export interface InventoryFormModel {
  productId: string;
  unitMeasureId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  warehouseId: string;
}
