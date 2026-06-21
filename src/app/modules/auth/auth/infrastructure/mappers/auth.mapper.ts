import { IdentityMapper } from '@modules/people/identity';
import { AuthResponse, UserAuth } from '../../domain/models/auth.model';
import { AuthApiDto, UserAuthApiDto } from '../dtos/auth-api.dto';
import { CompanyMapper } from '@modules/core/company/infrastructure/mappers/company.mapper';
import { UserCompanyMapper } from './user-company.mapper';

export const AuthMapper = {
  fromDto(dto: UserAuthApiDto | null | undefined): UserAuth | null {
    if (!dto) return null;
    return {
      identity: IdentityMapper.fromDto(dto.identity)!,
      id: dto.id,
      username: dto.username,
      active: dto.active,
      permissions: dto.permissions,
    };
  },

  fromAuthDto(dto: AuthApiDto | null | undefined): AuthResponse | null {
    if (!dto) return null;
    return {
      user: AuthMapper.fromDto(dto.user)!,
      role: dto.role,
      company: CompanyMapper.fromDto(dto.company)!,
      userCompanies: dto.userCompanies.map(
        (userCompanyDto) => UserCompanyMapper.fromDto(userCompanyDto)!,
      ),
      permissions: dto.permissions,
    };
  },

  toDto(model: UserAuth | null | undefined): UserAuthApiDto | null {
    if (!model) return null;
    return {
      identity: IdentityMapper.toDto(model.identity)!,
      id: model.id,
      username: model.username,
      active: model.active,
      permissions: model.permissions,
    };
  },
};
