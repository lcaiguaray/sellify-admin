import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { AuthResponse } from './../domain/models/auth.model';
import { AuthMapper } from './mappers/auth.mapper';
import { AuthRepository } from './../domain/repositories/auth.repository';
import { LoginFormModel } from './dtos/auth-form.dto';
import { AuthApiDto } from './dtos/auth-api.dto';

@Injectable({ providedIn: 'root' })
export class AuthHttpService extends BaseApiService implements AuthRepository {
  private readonly resource = 'auth';

  public login(credentials: LoginFormModel): Observable<ApiResponse<AuthResponse>> {
    const url = this.buildUrl(`${this.resource}/login`);
    return this.http.post<ApiResponse<AuthApiDto>>(url, credentials).pipe(
      map((response) => {
        const data = AuthMapper.fromAuthDto(response.data)!;
        return {
          ...response,
          data: data,
        };
      }),
    );
  }

  public logout(): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/logout`);
    return this.http.post<ApiResponse<void>>(url, {});
  }

  public refreshToken(): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/refresh`);
    return this.http.post<ApiResponse<void>>(url, {});
  }

  public me(): Observable<ApiResponse<AuthResponse>> {
    const url = this.buildUrl(`${this.resource}/me`);
    return this.http.get<ApiResponse<AuthApiDto>>(url).pipe(
      map((response) => {
        const data = AuthMapper.fromAuthDto(response.data)!;
        return {
          ...response,
          data: data,
        };
      }),
    );
  }
}
