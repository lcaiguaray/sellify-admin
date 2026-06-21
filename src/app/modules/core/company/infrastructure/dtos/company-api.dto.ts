export interface CompanyApiDto {
  id: string;
  taxId: string;
  businessName: string;
  tradeName: string | null;
  logoUrl: any | null;
  websiteUrl: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
