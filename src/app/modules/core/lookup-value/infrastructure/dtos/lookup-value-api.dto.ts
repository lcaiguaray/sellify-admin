export interface LookupValueApiDto {
  id: string;
  lookupGroupId: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
}