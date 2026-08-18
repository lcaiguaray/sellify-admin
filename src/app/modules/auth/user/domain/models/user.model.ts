import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Identity } from '@modules/people/identity';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface User extends BaseEntity {
  identity: Identity;
  username: string;
}

export interface UserSearchable extends Searchable {}

export const UserSearchableDefault: UserSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: null,
  sortBy: 'username',
  sortDir: 'asc',
};

export interface CreateUser {
  identityId?: string | null;
  documentTypeId: string;
  taxId: string;
  firstName: string;
  lastName: string;
  businessName: string;
  tradeName: string;
  email: string;
  phone: string;
  inceptionDate: string | null;
}
