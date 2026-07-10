export interface CategoryApiDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
