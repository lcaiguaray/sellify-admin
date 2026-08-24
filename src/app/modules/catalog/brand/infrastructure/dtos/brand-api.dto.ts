export interface BrandApiDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
