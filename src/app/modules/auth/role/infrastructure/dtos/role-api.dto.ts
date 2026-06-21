export interface RoleApiDto {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
