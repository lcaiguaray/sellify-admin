import { UnitConversion } from '../../domain/models/unit-conversion.model';
import { UnitConversionApiDto } from '../dtos/unit-conversion-api.dto';

export const UnitConversionMapper = {
  fromDto(dto: UnitConversionApiDto | null | undefined): UnitConversion {
    if (!dto) return {} as UnitConversion;
    return {
      id: dto.id,
      productId: dto.productId,
      productName: dto.productName,
      fromUnitId: dto.fromUnitId,
      fromUnitName: dto.fromUnitName,
      toUnitId: dto.toUnitId,
      toUnitName: dto.toUnitName,
      factor: dto.factor,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: UnitConversion | null | undefined): UnitConversionApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      productId: model.productId,
      productName: model.productName,
      fromUnitId: model.fromUnitId,
      fromUnitName: model.fromUnitName,
      toUnitId: model.toUnitId,
      toUnitName: model.toUnitName,
      factor: model.factor,
      active: model.active,
    };
  },
};
