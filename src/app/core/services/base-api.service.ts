import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  private readonly apiPrefix = 'api';

  protected buildUrl(resource: string): string {
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    const cleanResource = resource.replace(/^\//, '');
    return `${baseUrl}/${this.apiPrefix}/${cleanResource}`;
  }

  protected buildParams(criteria?: any): HttpParams {
    let params = new HttpParams();
    if (criteria) {
      Object.keys(criteria).forEach((key) => {
        const value = criteria[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return params;
  }
}
