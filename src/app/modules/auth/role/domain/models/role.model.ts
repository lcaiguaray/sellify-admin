import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';

export interface Role extends BaseEntity {
  name: string;
  description: string;
}
