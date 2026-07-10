import { Observable } from 'rxjs';
import { Contact, ContactSearchable, CreateContact } from '../models/contact.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class ContactRepository {
  abstract get(searchable: ContactSearchable): Observable<ApiPageResponse<Contact>>;
  abstract create(payload: CreateContact): Observable<ApiResponse<Contact>>;
  abstract update(contact: Contact): Observable<ApiResponse<Contact>>;
  abstract enable(id: Contact['id']): Observable<ApiResponse<void>>;
  abstract disable(id: Contact['id']): Observable<ApiResponse<void>>;
}
