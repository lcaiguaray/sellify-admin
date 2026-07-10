import { BaseEntity } from '@core/shared-kernel/models/base-entity.model';
import { Searchable } from '@core/shared-kernel/models/search-params.model';

export interface UnitConversion extends BaseEntity {
  productId: string;
  productName?: string;
  fromUnitId: string;
  fromUnitName?: string;
  toUnitId: string;
  toUnitName?: string;
  factor: number; // Cantidad de "toUnit" que hay en un "fromUnit". Ej: 1 Caja = 6 Paquetes (Factor 6)
}

export interface UnitConversionSearchable extends Searchable {
  productId?: string;
}

export const UnitConversionSearchableDefault: UnitConversionSearchable = {
  page: 0,
  size: 10,
  search: '',
  active: true,
  sortBy: 'createdAt',
  sortDir: 'desc',
};

export interface CreateUnitConversion {
  productId: string;
  fromUnitId: string;
  toUnitId: string;
  factor: number;
}
