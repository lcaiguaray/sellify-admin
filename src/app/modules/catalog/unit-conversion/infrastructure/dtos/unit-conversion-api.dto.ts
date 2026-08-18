import { UnitMeasureApiDto } from '@modules/catalog/unit-measure';

export interface UnitConversionApiDto {
  id: string;
  product: { id: string; name: string; sku: string | null } | null;
  fromUom: UnitMeasureApiDto;
  toUom: UnitMeasureApiDto;
  multiplier: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
