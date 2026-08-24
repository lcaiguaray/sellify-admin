import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface UnitMeasure extends BaseEntity {
  code: string;
  name: string;
  taxCode: string;
  symbol: string;
  description?: string;
}

export interface UnitMeasureSearchable extends Searchable {}

export const UnitMeasureSearchableDefault: UnitMeasureSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: null,
  sortBy: 'name',
  sortDir: 'desc',
};

export interface CreateUnitMeasure {
  code: string;
  name: string;
  taxCode: string;
  symbol: string;
  description?: string;
}
