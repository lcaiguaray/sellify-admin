import { Company } from '@modules/core/company';

export interface UserCompany {
  company: Company;
  userId: string;
  isDefault: boolean;
}
