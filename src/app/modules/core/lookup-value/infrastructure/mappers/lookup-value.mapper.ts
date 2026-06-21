import { LookupValue } from '../../domain/models/lookup-value.model';
import { LookupValueApiDto } from '../dtos/lookup-value-api.dto';

export const LookupValueMapper = {
  fromDto(dto: LookupValueApiDto| null | undefined): LookupValue | null {
    if (!dto) return null;
    return {
      id: dto.id,
      lookupGroupId: dto.lookupGroupId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      active: dto.active,
    };
  },

  toDto(model: LookupValue | null | undefined): LookupValueApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      lookupGroupId: model.lookupGroupId,
      code: model.code,
      name: model.name,
      description: model.description,
      active: model.active,
    };
  },
};
