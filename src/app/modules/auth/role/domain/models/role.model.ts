import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface Role extends BaseEntity {
  name: string;
  description: string | null;
}

export interface RoleSearchable extends Searchable {}

export const RoleSearchableDefault: RoleSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: null,
  sortBy: 'name',
  sortDir: 'asc',
};

export interface CreateRole {
  name: string;
  description: string | null;
}
