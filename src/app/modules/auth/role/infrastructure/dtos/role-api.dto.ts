export interface RoleApiDto {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
