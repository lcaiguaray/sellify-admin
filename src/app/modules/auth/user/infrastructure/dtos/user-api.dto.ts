import { IdentityApiDto } from "@modules/people/identity";

export interface UserApiDto {
  identity: IdentityApiDto;
  id: string;
  username: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}