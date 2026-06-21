import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Identity } from '@modules/people/identity';

export interface User extends BaseEntity {
  identity: Identity;
  username: string;
}
