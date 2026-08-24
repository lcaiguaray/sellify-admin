import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { ContactRepository } from './../domain/repositories/contact.repository';
import { Contact, ContactSearchable, CreateContact } from './../domain/models/contact.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { ContactApiDto } from './dtos/contact-api.dto';
import { ContactMapper } from './mappers/contact.mapper';

@Injectable({ providedIn: 'root' })
export class ContactHttpService extends BaseApiService implements ContactRepository {
  private readonly resource = '/crm/contacts';

  get(searchable: ContactSearchable): Observable<ApiPageResponse<Contact>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<ContactApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(ContactMapper.fromDto);
        return {
          ...response,
          data: {
            ...response.data,
            content: data,
          },
        };
      }),
    );
  }

  create(payload: CreateContact): Observable<ApiResponse<Contact>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<ContactApiDto>>(url, payload).pipe(
      map((response) => ({
        ...response,
        data: ContactMapper.fromDto(response.data),
      })),
    );
  }

  update(contact: Contact): Observable<ApiResponse<Contact>> {
    const url = this.buildUrl(`${this.resource}/${contact.id}`);
    return this.http.put<ApiResponse<ContactApiDto>>(url, contact).pipe(
      map((response) => ({
        ...response,
        data: ContactMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: Contact['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: Contact['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }
}
