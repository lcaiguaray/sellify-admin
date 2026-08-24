export interface UnitMeasureApiDto {
  id: string;
  code: string;
  name: string;
  taxCode: string;
  symbol: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
