import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ProductRepository } from './../domain/repositories/product.repository';
import { Product, ProductSearchable, CreateProduct } from './../domain/models/product.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Galletas Oreo Original',
    description: 'Galletas de chocolate con relleno de vainilla',
    sku: 'GAL-ORE-001',
    barcode: '7622210834524',
    categoryId: '3', // Galletas
    categoryName: 'Galletas',
    unitMeasureId: '1', // Unidad (paquete individual)
    unitMeasureName: 'Unidad',
    basePrice: 1.50,
    cost: 0.80,
    initialStock: 144, // 1 cajón = 8 cajas = 48 paquetes = 288 unidades. Initial stock could be 288
    brandId: '1', 
    brandName: 'Nabisco',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '2',
    name: 'Chocolate Sublime Extremo',
    description: 'Chocolate de leche con maní extragrande',
    sku: 'CHO-SUB-001',
    barcode: '7750885011701',
    categoryId: '2', // Chocolates
    categoryName: 'Chocolates',
    unitMeasureId: '1', 
    unitMeasureName: 'Unidad',
    basePrice: 2.50,
    cost: 1.20,
    initialStock: 240,
    brandId: '2',
    brandName: 'Nestlé',
    active: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: '3',
    name: 'Doritos Queso Atrevido',
    description: 'Snack de tortilla sabor queso',
    sku: 'SNA-DOR-001',
    barcode: '7702002345678',
    categoryId: '1', // Snacks Salados
    categoryName: 'Snacks Salados',
    unitMeasureId: '1',
    unitMeasureName: 'Unidad',
    basePrice: 1.80,
    cost: 0.90,
    initialStock: 100,
    brandId: '3',
    brandName: 'Frito Lay',
    active: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-04-20'),
  },
  {
    id: '4',
    name: 'Gomitas Morochas',
    description: 'Gomitas sabor a frutas surtidas',
    sku: 'GOL-MOR-001',
    barcode: '7751234567890',
    categoryId: '4', // Golosinas
    categoryName: 'Golosinas',
    unitMeasureId: '2', // Paquete
    unitMeasureName: 'Paquete',
    basePrice: 1.20,
    cost: 0.50,
    initialStock: 300,
    brandId: '2',
    brandName: 'Nestlé',
    active: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '5',
    name: 'Inca Kola Personal 500ml',
    description: 'Gaseosa sabor original peruano',
    sku: 'BEB-INK-001',
    barcode: '7751234567891',
    categoryId: '5', // Bebidas
    categoryName: 'Bebidas',
    unitMeasureId: '1', // Unidad
    unitMeasureName: 'Unidad',
    basePrice: 2.50,
    cost: 1.50,
    initialStock: 120,
    brandId: '4',
    brandName: 'Coca Cola Company',
    active: true,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-06-20'),
  },
];

@Injectable({ providedIn: 'root' })
export class ProductMockService implements ProductRepository {
  private products = [...MOCK_PRODUCTS];

  get(searchable: ProductSearchable): Observable<ApiPageResponse<Product>> {
    let filtered = [...this.products];

    // Filter by search
    if (searchable.search) {
      const term = searchable.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          (p.brandName && p.brandName.toLowerCase().includes(term)),
      );
    }

    // Filter by active
    if (searchable.active !== null) {
      filtered = filtered.filter((p) => p.active === searchable.active);
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

  create(payload: CreateProduct): Observable<ApiResponse<Product>> {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...payload,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.unshift(newProduct);

    return of({
      status: 201,
      message: 'Producto creado exitosamente',
      data: newProduct,
    }).pipe(delay(300));
  }

  update(product: Product): Observable<ApiResponse<Product>> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products[index] = { ...product, updatedAt: new Date() };
    }

    return of({
      status: 200,
      message: 'Producto actualizado exitosamente',
      data: this.products[index],
    }).pipe(delay(300));
  }

  enable(id: Product['id']): Observable<ApiResponse<void>> {
    const product = this.products.find((p) => p.id === id);
    if (product) product.active = true;

    return of({
      status: 200,
      message: 'Producto habilitado exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  disable(id: Product['id']): Observable<ApiResponse<void>> {
    const product = this.products.find((p) => p.id === id);
    if (product) product.active = false;

    return of({
      status: 200,
      message: 'Producto deshabilitado exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }
}
