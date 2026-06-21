import { Observable } from 'rxjs';
import { ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { AuthResponse } from '../models/auth.model';
import { LoginFormModel } from '../../infrastructure/dtos/auth-form.dto';

export abstract class AuthRepository {
  abstract login(credentials: LoginFormModel): Observable<ApiResponse<AuthResponse>>;
  abstract logout(): Observable<ApiResponse<void>>;
  abstract refreshToken(): Observable<ApiResponse<void>>;
  abstract me(): Observable<ApiResponse<AuthResponse>>;
}
