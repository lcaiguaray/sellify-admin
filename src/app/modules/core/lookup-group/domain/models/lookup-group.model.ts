import { SimpleEntity } from '@core/shared-kernel/models/base-entity.model';

export interface LookupGroup extends SimpleEntity {
  name: string;
  description: string | null;
}
