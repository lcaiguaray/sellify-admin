import { RoleApiDto } from '@modules/auth/role';
import { CompanyApiDto } from '@modules/core/company/infrastructure/dtos/company-api.dto';
import { IdentityApiDto } from '@modules/people/identity';

export interface UserCompanyApiDto {
  company: CompanyApiDto;
  userId: string;
  isDefault: boolean;
}

export interface UserAuthApiDto {
  identity: IdentityApiDto;
  id: string;
  username: string;
  active: boolean;
  permissions: string[];
}

export interface AuthApiDto {
  user: UserAuthApiDto;
  role: RoleApiDto;
  company: CompanyApiDto;
  userCompanies: UserCompanyApiDto[];
  permissions: string[];
}
