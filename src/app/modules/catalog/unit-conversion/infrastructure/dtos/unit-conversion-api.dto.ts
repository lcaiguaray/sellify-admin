export interface UnitConversionApiDto {
  id: string;
  productId: string;
  productName?: string;
  fromUnitId: string;
  fromUnitName?: string;
  toUnitId: string;
  toUnitName?: string;
  factor: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
