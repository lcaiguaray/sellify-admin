import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { LookupValue } from '@modules/core/lookup-value';

export interface Identity extends BaseEntity {
  documentType: LookupValue;
  gender: LookupValue | null;
  civilStatus: LookupValue | null;
  educationLevel: LookupValue | null;
  isLegalEntity: boolean;
  taxId: string;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  tradeName: string | null;
  email: string | null;
  phone: string | null;
  inceptionDate: string;
}
