import { SimpleEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface LookupGroup extends SimpleEntity {
  name: string;
  description: string | null;
}

export interface LookupGroupSearchable extends Searchable {}

export const LookupGroupSearchableDefault: LookupGroupSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: null,
  sortBy: 'name',
  sortDir: 'asc',
};
