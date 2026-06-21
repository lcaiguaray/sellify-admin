export interface BrandApiDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
