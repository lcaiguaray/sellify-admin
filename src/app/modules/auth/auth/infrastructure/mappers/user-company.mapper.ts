import { CompanyMapper } from '@modules/core/company/infrastructure/mappers/company.mapper';
import { UserCompany } from '../../domain/models/user-company.mode';
import { UserCompanyApiDto } from '../dtos/auth-api.dto';

export const UserCompanyMapper = {
  fromDto(dto: UserCompanyApiDto | null | undefined): UserCompany | null {
    if (!dto) return null;
    return {
      company: CompanyMapper.fromDto(dto.company)!,
      userId: dto.userId,
      isDefault: dto.isDefault,
    };
  },

  toDto(model: UserCompany | null | undefined): UserCompanyApiDto | null {
    if (!model) return null;
    return {
      company: CompanyMapper.toDto(model.company)!,
      userId: model.userId,
      isDefault: model.isDefault,
    };
  },
};
