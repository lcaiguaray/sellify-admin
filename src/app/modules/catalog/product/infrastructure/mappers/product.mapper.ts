import { Product } from '../../domain/models/product.model';
import { ProductApiDto } from '../dtos/product-api.dto';

export const ProductMapper = {
  fromDto(dto: ProductApiDto | null | undefined): Product {
    if (!dto) return {} as Product;
    return {
      id: dto.id,
      name: dto.name,
      sku: dto.sku,
      description: dto.description,
      barcode: dto.barcode,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
      unitMeasureId: dto.unitMeasureId,
      unitMeasureName: dto.unitMeasureName,
      basePrice: dto.basePrice,
      cost: dto.cost,
      initialStock: dto.initialStock,
      brandId: dto.brandId,
      brandName: dto.brandName,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Product | null | undefined): ProductApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      name: model.name,
      sku: model.sku,
      description: model.description,
      barcode: model.barcode,
      categoryId: model.categoryId,
      categoryName: model.categoryName,
      unitMeasureId: model.unitMeasureId,
      unitMeasureName: model.unitMeasureName,
      basePrice: model.basePrice,
      cost: model.cost,
      initialStock: model.initialStock,
      brandId: model.brandId,
      brandName: model.brandName,
      active: model.active,
    };
  },
};
