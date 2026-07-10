import { InventoryItem } from '../../domain/models/inventory.model';
import { InventoryApiDto } from '../dtos/inventory-api.dto';

export const InventoryMapper = {
  fromDto(dto: InventoryApiDto | null | undefined): InventoryItem {
    if (!dto) return {} as InventoryItem;
    return {
      id: dto.id,
      productId: dto.productId,
      productName: dto.productName,
      sku: dto.sku,
      unitMeasureId: dto.unitMeasureId,
      unitMeasureName: dto.unitMeasureName,
      quantity: dto.quantity,
      minStock: dto.minStock,
      maxStock: dto.maxStock,
      warehouseId: dto.warehouseId,
      warehouseName: dto.warehouseName,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: InventoryItem | null | undefined): InventoryApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      productId: model.productId,
      productName: model.productName,
      sku: model.sku,
      unitMeasureId: model.unitMeasureId,
      unitMeasureName: model.unitMeasureName,
      quantity: model.quantity,
      minStock: model.minStock,
      maxStock: model.maxStock,
      warehouseId: model.warehouseId,
      warehouseName: model.warehouseName,
      active: model.active,
    };
  },
};
