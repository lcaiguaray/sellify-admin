import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { UnitConversionRepository } from '../domain/repositories/unit-conversion.repository';
import {
  UnitConversion,
  UnitConversionSearchable,
  CreateUnitConversion,
} from '../domain/models/unit-conversion.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

const MOCK_CONVERSIONS: UnitConversion[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Galletas Oreo Original',
    fromUnitId: '4', // Cajón
    fromUnitName: 'Cajón',
    toUnitId: '3', // Caja
    toUnitName: 'Caja',
    factor: 8,
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '2',
    productId: '1',
    productName: 'Galletas Oreo Original',
    fromUnitId: '3', // Caja
    fromUnitName: 'Caja',
    toUnitId: '2', // Paquete
    toUnitName: 'Paquete',
    factor: 6,
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '3',
    productId: '1',
    productName: 'Galletas Oreo Original',
    fromUnitId: '2', // Paquete
    fromUnitName: 'Paquete',
    toUnitId: '1', // Unidad
    toUnitName: 'Unidad',
    factor: 6,
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
];

@Injectable({ providedIn: 'root' })
export class UnitConversionMockService implements UnitConversionRepository {
  private conversions = [...MOCK_CONVERSIONS];

  get(searchable: UnitConversionSearchable): Observable<ApiPageResponse<UnitConversion>> {
    let filtered = [...this.conversions];

    if (searchable.productId) {
      filtered = filtered.filter((c) => c.productId === searchable.productId);
    }

    if (searchable.search) {
      const term = searchable.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          (c.productName && c.productName.toLowerCase().includes(term)) ||
          (c.fromUnitName && c.fromUnitName.toLowerCase().includes(term)) ||
          (c.toUnitName && c.toUnitName.toLowerCase().includes(term)),
      );
    }

    if (searchable.active !== null) {
      filtered = filtered.filter((c) => c.active === searchable.active);
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

  create(payload: CreateUnitConversion): Observable<ApiResponse<UnitConversion>> {
    const newConversion: UnitConversion = {
      id: crypto.randomUUID(),
      ...payload,
      productName: 'Producto Mock',
      fromUnitName: 'Mock From',
      toUnitName: 'Mock To',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversions.unshift(newConversion);

    return of({
      status: 201,
      message: 'Conversión creada exitosamente',
      data: newConversion,
    }).pipe(delay(300));
  }

  update(conversion: UnitConversion): Observable<ApiResponse<UnitConversion>> {
    const index = this.conversions.findIndex((c) => c.id === conversion.id);
    if (index !== -1) {
      this.conversions[index] = { ...conversion, updatedAt: new Date() };
    }

    return of({
      status: 200,
      message: 'Conversión actualizada exitosamente',
      data: this.conversions[index],
    }).pipe(delay(300));
  }

  enable(id: UnitConversion['id']): Observable<ApiResponse<void>> {
    const conversion = this.conversions.find((c) => c.id === id);
    if (conversion) conversion.active = true;

    return of({
      status: 200,
      message: 'Conversión habilitada exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  disable(id: UnitConversion['id']): Observable<ApiResponse<void>> {
    const conversion = this.conversions.find((c) => c.id === id);
    if (conversion) conversion.active = false;

    return of({
      status: 200,
      message: 'Conversión deshabilitada exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }
}
