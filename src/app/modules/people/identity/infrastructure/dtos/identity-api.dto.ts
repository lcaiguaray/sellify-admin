import { LookupValueApiDto } from "@modules/core/lookup-value";

export interface IdentityApiDto {
  documentType: LookupValueApiDto;
  gender: LookupValueApiDto | null;
  civilStatus: LookupValueApiDto | null;
  educationLevel: LookupValueApiDto | null;
  id: string;
  isLegalEntity: boolean;
  taxId: string;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  tradeName: string | null;
  email: string | null;
  phone: string | null;
  inceptionDate: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}