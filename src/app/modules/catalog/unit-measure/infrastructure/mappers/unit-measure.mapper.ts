import { UnitMeasure } from '../../domain/models/unit-measure.model';
import { UnitMeasureApiDto } from '../dtos/unit-measure-api.dto';

export const UnitMeasureMapper = {
  fromDto(dto: UnitMeasureApiDto | null | undefined): UnitMeasure {
    if (!dto) return {} as UnitMeasure;
    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      taxCode: dto.taxCode,
      symbol: dto.symbol,
      description: dto.description,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: UnitMeasure | null | undefined): UnitMeasureApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      code: model.code,
      name: model.name,
      taxCode: model.taxCode,
      symbol: model.symbol,
      description: model.description,
      active: model.active,
    };
  },
};
