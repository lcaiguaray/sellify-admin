import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { InventoryRepository } from './../domain/repositories/inventory.repository';
import { InventoryItem, InventorySearchable, CreateInventoryItem } from './../domain/models/inventory.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Laptop Gamer Pro',
    sku: 'SUB-CAJ-001',
    unitMeasureId: '4', // Cajón
    unitMeasureName: 'Cajón',
    quantity: 5,
    minStock: 5,
    maxStock: 50,
    warehouseId: 'wh-01',
    warehouseName: 'Almacén Central',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Monitor Curvo 27"',
    sku: 'SUB-CJA-002',
    unitMeasureId: '3', // Caja
    unitMeasureName: 'Caja',
    quantity: 12,
    minStock: 10,
    maxStock: 80,
    warehouseId: 'wh-01',
    warehouseName: 'Almacén Central',
    active: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: '3',
    productId: '3',
    productName: 'Teclado Mecánico RGB',
    sku: 'SUB-UND-003',
    unitMeasureId: '1', // Unidad
    unitMeasureName: 'Unidad',
    quantity: 120,
    minStock: 20,
    maxStock: 200,
    warehouseId: 'wh-02',
    warehouseName: 'Almacén Norte',
    active: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-04-20'),
  },
  {
    id: '4',
    productId: '4',
    productName: 'Mouse Inalámbrico Ergonómico',
    sku: 'ORE-CJA-004',
    unitMeasureId: '3', // Caja
    unitMeasureName: 'Caja',
    quantity: 30,
    minStock: 15,
    maxStock: 100,
    warehouseId: 'wh-01',
    warehouseName: 'Almacén Central',
    active: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '5',
    productId: '5',
    productName: 'Auriculares Noise Cancelling',
    sku: 'ORE-UND-005',
    unitMeasureId: '1', // Unidad
    unitMeasureName: 'Unidad',
    quantity: 67,
    minStock: 10,
    maxStock: 150,
    warehouseId: 'wh-02',
    warehouseName: 'Almacén Norte',
    active: true,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '6',
    productId: '6',
    productName: 'Webcam 4K Ultra HD',
    sku: 'MOR-CJA-006',
    unitMeasureId: '3', // Caja
    unitMeasureName: 'Caja',
    quantity: 0,
    minStock: 5,
    maxStock: 30,
    warehouseId: 'wh-01',
    warehouseName: 'Almacén Central',
    active: false,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-25'),
  },
];

@Injectable({ providedIn: 'root' })
export class InventoryMockService implements InventoryRepository {
  private items = [...MOCK_INVENTORY];

  get(searchable: InventorySearchable): Observable<ApiPageResponse<InventoryItem>> {
    let filtered = [...this.items];

    // Filter by search
    if (searchable.search) {
      const term = searchable.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i.productName && i.productName.toLowerCase().includes(term)) ||
          (i.sku && i.sku.toLowerCase().includes(term)) ||
          (i.warehouseName && i.warehouseName.toLowerCase().includes(term)),
      );
    }

    // Filter by active
    if (searchable.active !== null) {
      filtered = filtered.filter((i) => i.active === searchable.active);
    }

    // Sort
    filtered.sort((a, b) => {
      const dir = searchable.sortDir === 'asc' ? 1 : -1;
      const aVal = (a as any)[searchable.sortBy];
      const bVal = (b as any)[searchable.sortBy];
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });

    // Paginate
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

  create(payload: CreateInventoryItem): Observable<ApiResponse<InventoryItem>> {
    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      ...payload,
      productName: 'Nuevo Producto',
      unitMeasureName: 'Unidad Base',
      sku: 'NEW-SKU-' + Math.floor(Math.random() * 1000),
      warehouseName: payload.warehouseId ? 'Almacén Asignado' : undefined,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.unshift(newItem);

    return of({
      status: 201,
      message: 'Registro de inventario creado exitosamente',
      data: newItem,
    }).pipe(delay(300));
  }

  update(item: InventoryItem): Observable<ApiResponse<InventoryItem>> {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = { ...item, updatedAt: new Date() };
    }

    return of({
      status: 200,
      message: 'Registro de inventario actualizado exitosamente',
      data: this.items[index],
    }).pipe(delay(300));
  }

  enable(id: InventoryItem['id']): Observable<ApiResponse<void>> {
    const item = this.items.find((i) => i.id === id);
    if (item) item.active = true;

    return of({
      status: 200,
      message: 'Registro habilitado exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  disable(id: InventoryItem['id']): Observable<ApiResponse<void>> {
    const item = this.items.find((i) => i.id === id);
    if (item) item.active = false;

    return of({
      status: 200,
      message: 'Registro deshabilitado exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  fractionate(payload: { inventoryItemId: string; quantity: number; toUnitId: string; factor: number; toUnitName: string; }): Observable<ApiResponse<void>> {
    const item = this.items.find((i) => i.id === payload.inventoryItemId);
    if (!item) {
      throw new Error('Item no encontrado');
    }

    if (item.quantity < payload.quantity) {
      throw new Error('Cantidad insuficiente para fraccionar');
    }

    // Deduce quantity from source
    item.quantity -= payload.quantity;

    // Add quantity to target
    const addedQuantity = payload.quantity * payload.factor;
    const targetItem = this.items.find((i) => i.productId === item.productId && i.unitMeasureId === payload.toUnitId);
    
    if (targetItem) {
      targetItem.quantity += addedQuantity;
    } else {
      // Create new inventory row if it doesn't exist
      this.items.push({
        id: crypto.randomUUID(),
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        unitMeasureId: payload.toUnitId,
        unitMeasureName: payload.toUnitName,
        quantity: addedQuantity,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return of({
      status: 200,
      message: 'Fraccionamiento realizado exitosamente',
      data: undefined as any,
    }).pipe(delay(400));
  }
}
