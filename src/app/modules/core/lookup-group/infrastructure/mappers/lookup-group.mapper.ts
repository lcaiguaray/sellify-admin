import { LookupGroup } from '../../domain/models/lookup-group.model';
import { LookupGroupApiDto } from '../dtos/lookup-group-api.dto';

export const LookupGroupMapper = {
  fromDto(dto: LookupGroupApiDto | null | undefined): LookupGroup | null {
    if (!dto) return null;
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      active: dto.active,
    };
  },

  toDto(model: LookupGroup | null | undefined): LookupGroupApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      active: model.active,
    };
  },
};
