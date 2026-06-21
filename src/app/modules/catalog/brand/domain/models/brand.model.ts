import { BaseEntity } from "@core/shared-kernel/models/base-entity.model";
import { Searchable } from "@core/shared-kernel/models/search-params.model";

export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface BrandSearchable extends Searchable {}

export const BrandSearchableDefault: BrandSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: true,
  sortBy: 'createdAt',
  sortDir: 'desc',
};

export interface CreateBrand {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}