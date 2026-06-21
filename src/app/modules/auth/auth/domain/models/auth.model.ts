import { Role } from '@modules/auth/role';
import { Company } from '@modules/core/company';
import { Identity } from '@modules/people/identity';
import { UserCompany } from './user-company.mode';

export interface UserAuth {
  identity: Identity;
  id: string;
  username: string;
  active: boolean;
  permissions: string[];
}

export interface AuthResponse {
  user: UserAuth;
  role: Role;
  company: Company;
  userCompanies: UserCompany[];
  permissions: string[];
}
