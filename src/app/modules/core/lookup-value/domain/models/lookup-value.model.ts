import { SimpleEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface LookupValue extends SimpleEntity {
  lookupGroupId: string;
  code: string;
  name: string;
  description: string | null;
}

export interface LookupValueSearchable extends Searchable {
  lookupGroupId: string;
}

export const createLookupValueSearchable = (lookupGroupId: string): LookupValueSearchable => ({
  page: 0,
  size: 10,
  lookupGroupId,
  search: '',
  active: null,
  sortBy: 'name',
  sortDir: 'asc',
});

export interface CreateLookupValue {
  lookupGroupId: string;
  code: string;
  name: string;
  description: string | null;
  attributes?: Record<string, unknown>;
}
