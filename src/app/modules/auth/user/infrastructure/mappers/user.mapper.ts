import { IdentityMapper } from '@modules/people/identity';
import { User } from '../../domain/models/user.model';
import { UserApiDto } from '../dtos/user-api.dto';

export const UserMapper = {
  fromDto(dto: UserApiDto | null | undefined): User | null {
    if (!dto) return null;
    return {
      identity: IdentityMapper.fromDto(dto.identity)!,
      id: dto.id,
      username: dto.username,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: User | null | undefined): UserApiDto | null {
    if (!model) return null;
    return {
      identity: IdentityMapper.toDto(model.identity)!,
      id: model.id,
      username: model.username,
      active: model.active,
    };
  },
};
