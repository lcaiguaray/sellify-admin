export interface CategoryApiDto {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
