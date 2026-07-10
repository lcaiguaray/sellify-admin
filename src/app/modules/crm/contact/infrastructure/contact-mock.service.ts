import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ContactRepository } from './../domain/repositories/contact.repository';
import { Contact, ContactSearchable, CreateContact } from './../domain/models/contact.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    documentType: 'DNI',
    documentNumber: '71234567',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+51 987 654 321',
    address: 'Av. Los Incas 123',
    isCustomer: true,
    isProvider: false,
    isEmployee: true,
    active: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-05-20'),
  },
  {
    id: '2',
    documentType: 'RUC',
    documentNumber: '20123456789',
    name: 'Inversiones XYZ S.A.C.',
    email: 'ventas@inversionesxyz.com',
    phone: '+51 1 456 7890',
    address: 'Calle Las Nazarenas 456',
    isCustomer: false,
    isProvider: true,
    isEmployee: false,
    active: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-04-10'),
  },
  {
    id: '3',
    documentType: 'DNI',
    documentNumber: '40987654',
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+51 912 345 678',
    address: 'Urb. Los Pinos Mz. A Lt. 1',
    isCustomer: true,
    isProvider: false,
    isEmployee: false,
    active: true,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '4',
    documentType: 'RUC',
    documentNumber: '10712345678',
    name: 'Carlos Ruiz EIRL',
    email: 'carlos@ruiz.com',
    phone: '+51 999 888 777',
    address: 'Jr. Comercio 789',
    isCustomer: true,
    isProvider: true,
    isEmployee: false,
    active: true,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-06-15'),
  },
];

@Injectable({ providedIn: 'root' })
export class ContactMockService implements ContactRepository {
  private items = [...MOCK_CONTACTS];

  get(searchable: ContactSearchable): Observable<ApiPageResponse<Contact>> {
    let filtered = [...this.items];

    // Filter by search
    if (searchable.search) {
      const term = searchable.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.documentNumber.includes(term) ||
          (i.email && i.email.toLowerCase().includes(term)),
      );
    }

    // Filter by role
    if (searchable.role && searchable.role !== 'all') {
      filtered = filtered.filter((i) => {
        if (searchable.role === 'customer') return i.isCustomer;
        if (searchable.role === 'provider') return i.isProvider;
        if (searchable.role === 'employee') return i.isEmployee;
        return true;
      });
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

  create(payload: CreateContact): Observable<ApiResponse<Contact>> {
    const newItem: Contact = {
      id: crypto.randomUUID(),
      ...payload,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.unshift(newItem);

    return of({
      status: 201,
      message: 'Contacto registrado exitosamente',
      data: newItem,
    }).pipe(delay(300));
  }

  update(item: Contact): Observable<ApiResponse<Contact>> {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = { ...item, updatedAt: new Date() };
    }

    return of({
      status: 200,
      message: 'Contacto actualizado exitosamente',
      data: this.items[index],
    }).pipe(delay(300));
  }

  enable(id: Contact['id']): Observable<ApiResponse<void>> {
    const item = this.items.find((i) => i.id === id);
    if (item) item.active = true;

    return of({
      status: 200,
      message: 'Contacto habilitado exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }

  disable(id: Contact['id']): Observable<ApiResponse<void>> {
    const item = this.items.find((i) => i.id === id);
    if (item) item.active = false;

    return of({
      status: 200,
      message: 'Contacto deshabilitado exitosamente',
      data: undefined as any,
    }).pipe(delay(200));
  }
}
