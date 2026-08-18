import { UnitConversion } from '../../domain/models/unit-conversion.model';
import { UnitConversionApiDto } from '../dtos/unit-conversion-api.dto';

export const UnitConversionMapper = {
  fromDto(dto: UnitConversionApiDto | null | undefined): UnitConversion {
    if (!dto) return {} as UnitConversion;
    return {
      id: dto.id,
      productId: dto.product?.id ?? null,
      productName: dto.product?.name ?? 'Conversión general',
      fromUnitId: dto.fromUom.id,
      fromUnitName: dto.fromUom.name,
      toUnitId: dto.toUom.id,
      toUnitName: dto.toUom.name,
      factor: Number(dto.multiplier),
      active: dto.active ?? true,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: UnitConversion | null | undefined): UnitConversionApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      product: model.productId
        ? { id: model.productId, name: model.productName ?? '', sku: null }
        : null,
      fromUom: {
        id: model.fromUnitId,
        code: '',
        name: model.fromUnitName ?? '',
        taxCode: '',
        symbol: '',
        active: true,
      },
      toUom: {
        id: model.toUnitId,
        code: '',
        name: model.toUnitName ?? '',
        taxCode: '',
        symbol: '',
        active: true,
      },
      multiplier: model.factor,
      active: model.active,
    };
  },
};
