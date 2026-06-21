import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';

export interface Company extends BaseEntity {
  taxId: string;
  businessName: string;
  tradeName: string | null;
  logoUrl: any | null;
  websiteUrl: string | null;
}
