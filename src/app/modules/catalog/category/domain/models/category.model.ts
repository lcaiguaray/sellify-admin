import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
}

export interface CategorySearchable extends Searchable {}

export const CategorySearchableDefault: CategorySearchable = {
  page: 0,
  size: 10,
  search: '',
  active: null,
  sortBy: 'name',
  sortDir: 'desc',
};

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
}
