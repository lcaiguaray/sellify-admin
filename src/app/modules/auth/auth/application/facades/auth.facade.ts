import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { AuthResponse, UserAuth } from '../../domain/models/auth.model';
import { Role } from '@modules/auth/role';
import { Company } from '@modules/core/company';
import { UserCompany } from '../../domain/models/user-company.mode';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginFormModel } from '../../infrastructure/dtos/auth-form.dto';
import { ApiResponse } from '@core/shared-kernel/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly repository = inject(AuthRepository);

  readonly user = signal<UserAuth | null>(null);
  readonly role = signal<Role | null>(null);
  readonly company = signal<Company | null>(null);
  readonly companies = signal<UserCompany[]>([]);

  readonly isAuthenticated = computed(() => this.user() !== null);

  hasPermission(permission: string): boolean {
    return this.user()?.permissions.includes(permission) ?? false;
  }

  async login(payload: LoginFormModel): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await firstValueFrom(this.repository.login(payload));
      const data = response.data;

      this.user.set({ ...data.user, permissions: data.permissions });
      this.role.set(data.role);
      this.company.set(data.company);
      this.companies.set(data.userCompanies);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async me() {
    try {
      const { data } = await firstValueFrom(this.repository.me());

      this.user.set({ ...data.user, permissions: data.permissions });
      this.role.set(data.role);
      this.company.set(data.company);
      this.companies.set(data.userCompanies);
    } catch (err) {
      this.clearLocalSession();
    }
  }

  refreshToken(): Observable<ApiResponse<void>> {
    return this.repository.refreshToken().pipe(
      catchError((err) => {
        this.clearLocalSession();
        throw err;
      }),
    );
  }

  async logout() {
    try {
      await firstValueFrom(this.repository.logout());
      this.clearLocalSession();
    } catch (err) {
      this.clearLocalSession();
    }
  }

  public clearLocalSession(): void {
    this.user.set(null);
    this.role.set(null);
    this.company.set(null);
    this.companies.set([]);
  }
}
