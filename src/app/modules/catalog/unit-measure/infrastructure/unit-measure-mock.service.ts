import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { UnitMeasureRepository } from '../domain/repositories/unit-measure.repository';
import {
  UnitMeasure,
  UnitMeasureSearchable,
  CreateUnitMeasure,
} from '../domain/models/unit-measure.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

const MOCK_UNIT_MEASURES: UnitMeasure[] = [
  {
    id: '1',
    code: 'NIU',
    name: 'Unidad',
    taxCode: 'NIU',
    symbol: 'und',
    description: 'Unidad base suelta',
    active: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '2',
    code: 'PK',
    name: 'Paquete',
    taxCode: 'PK',
    symbol: 'paq',
    description: 'Paquete de productos',
    active: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-05-20'),
  },
  {
    id: '3',
    code: 'BX',
    name: 'Caja',
    taxCode: 'BX',
    symbol: 'cja',
    description: 'Caja que contiene múltiples paquetes',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '4',
    code: 'CR',
    name: 'Cajón',
    taxCode: 'CR',
    symbol: 'cjn',
    description: 'Cajón mayorista',
    active: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '5',
    code: 'DSP',
    name: 'Display',
    taxCode: 'DSP',
    symbol: 'dsp',
    description: 'Display exhibidor para mostrador',
    active: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '6',
    code: 'BG',
    name: 'Bolsa',
    taxCode: 'BG',
    symbol: 'bls',
    description: 'Bolsa de productos a granel',
    active: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-15'),
  },
];

@Injectable({ providedIn: 'root' })
export class UnitMeasureMockService implements UnitMeasureRepository {
  private unitMeasures = [...MOCK_UNIT_MEASURES];

  get(searchable: UnitMeasureSearchable): Observable<ApiPageResponse<UnitMeasure>> {
    let filtered = [...this.unitMeasures];

    if (searchable.search) {
      const term = searchable.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.code.toLowerCase().includes(term) ||
          u.symbol.toLowerCase().includes(term) ||
          (u.description && u.description.toLowerCase().includes(term)),
      );
    }

    if (searchable.active !== null) {
      filtered = filtered.filter((u) => u.active === searchable.active);
    }

    filtered.sort((a, b) => {
      const dir = searchable.sortDir === 'asc' ? 1 : -1;
      const aVal = (a as any)[searchable.sortBy];
      const bVal = (b as any)[searchable.sortBy];
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });

    const start = searchable.page * searchable.size;
    const paged = filtered.slice(start, start + searchable.size);
    const totalPages = Math.ceil(filtered.length / searchable.size);

    return of({
      status: 200,
      message: 'OK',
      data: {
        content: paged,
        pageNumber: searchable.page,
        pageSize: searchable.size,
        totalElements: filtered.length,
        totalPages,
        isLast: searchable.page >= totalPages - 1,
      },
    }).pipe(delay(400));
  }

  create(payload: CreateUnitMeasure): Observable<ApiResponse<UnitMeasure>> {
    const newUnitMeasure: UnitMeasure = {
      id: crypto.randomUUID(),
      ...payload,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.unitMeasures.unshift(newUnitMeasure);

    return of({
      status: 201,
      message: 'Unidad de medida creada exitosamente',
      data: newUnitMeasure,
    }).pipe(delay(300));
  }

  update(unitMeasure: UnitMeasure): Observable<ApiResponse<UnitMeasure>> {
    const index = this.unitMeasures.findIndex((u) => u.id === unitMeasure.id);
    if (index !== -1) {
      this.unitMeasures[index] = { ...unitMeasure, updatedAt: new Date() };
    }

    return of({
      status: 200,
      message: 'Unidad de medida actualizada exitosamente',
      data: this.unitMeasures[index],
    }).pipe(delay(300));
  }

  enable(id: UnitMeasure['id']): Observable<ApiResponse<void>> {
    const unitMeasure = this.unitMeasures.find((u) => u.id === id);
    if (unitMeasure) unitMeasure.active = true;

    return of({
      status: 200,
      message: 'Unidad de medida habilitada exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  disable(id: UnitMeasure['id']): Observable<ApiResponse<void>> {
    const unitMeasure = this.unitMeasures.find((u) => u.id === id);
    if (unitMeasure) unitMeasure.active = false;

    return of({
      status: 200,
      message: 'Unidad de medida deshabilitada exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }
}
