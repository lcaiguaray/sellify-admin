import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { CategoryRepository } from '../domain/repositories/category.repository';
import { Category, CategorySearchable, CreateCategory } from '../domain/models/category.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    parentId: null,
    name: 'Snacks Salados',
    slug: 'snacks-salados',
    description: 'Papas fritas, chizitos, doritos y snacks salados en general',
    active: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '2',
    parentId: null,
    name: 'Chocolates',
    slug: 'chocolates',
    description: 'Barras de chocolate, bombones y tabletas',
    active: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-05-20'),
  },
  {
    id: '3',
    parentId: null,
    name: 'Galletas',
    slug: 'galletas',
    description: 'Galletas dulces, saladas, rellenas y wafers',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '4',
    parentId: null,
    name: 'Golosinas',
    slug: 'golosinas',
    description: 'Caramelos, gomitas, chupetines y dulces varios',
    active: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '5',
    parentId: null,
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Gaseosas, jugos, aguas y bebidas energéticas',
    active: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '6',
    parentId: null,
    name: 'Frutos Secos',
    slug: 'frutos-secos',
    description: 'Maní, almendras, nueces y mix de frutos secos',
    active: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-15'),
  },
];

@Injectable({ providedIn: 'root' })
export class CategoryMockService implements CategoryRepository {
  private categories = [...MOCK_CATEGORIES];

  get(searchable: CategorySearchable): Observable<ApiPageResponse<Category>> {
    let filtered = [...this.categories];

    if (searchable.search) {
      const term = searchable.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.description && c.description.toLowerCase().includes(term)),
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

  create(payload: CreateCategory): Observable<ApiResponse<Category>> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      ...payload,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.unshift(newCategory);

    return of({
      status: 201,
      message: 'Categoría creada exitosamente',
      data: newCategory,
    }).pipe(delay(300));
  }

  update(category: Category): Observable<ApiResponse<Category>> {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = { ...category, updatedAt: new Date() };
    }

    return of({
      status: 200,
      message: 'Categoría actualizada exitosamente',
      data: this.categories[index],
    }).pipe(delay(300));
  }

  enable(id: Category['id']): Observable<ApiResponse<void>> {
    const category = this.categories.find((c) => c.id === id);
    if (category) category.active = true;

    return of({
      status: 200,
      message: 'Categoría habilitada exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  disable(id: Category['id']): Observable<ApiResponse<void>> {
    const category = this.categories.find((c) => c.id === id);
    if (category) category.active = false;

    return of({
      status: 200,
      message: 'Categoría deshabilitada exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }
}
