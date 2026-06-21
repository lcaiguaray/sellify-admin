import { Role } from '../../domain/models/role.model';
import { RoleApiDto } from '../dtos/role-api.dto';

export const RoleMapper = {
  fromDto(dto: RoleApiDto | null | undefined): Role | null {
    if (!dto) return null;
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Role | null | undefined): RoleApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      active: model.active,
    };
  },
};
