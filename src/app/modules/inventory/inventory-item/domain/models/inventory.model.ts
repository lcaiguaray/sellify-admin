import { BaseEntity } from "@core/shared-kernel/models/base-entity.model";
import { Searchable } from "@core/shared-kernel/models/search-params.model";

export interface InventoryItem extends BaseEntity {
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
}

export interface InventorySearchable extends Searchable {}

export const InventorySearchableDefault: InventorySearchable = {
  page: 0,
  size: 10,
  search: '',
  active: true,
  sortBy: 'createdAt',
  sortDir: 'desc',
};

export interface CreateInventoryItem {
  productId: string;
  unitMeasureId: string;
  quantity: number;
  minStock?: number;
  maxStock?: number;
  warehouseId?: string;
}
