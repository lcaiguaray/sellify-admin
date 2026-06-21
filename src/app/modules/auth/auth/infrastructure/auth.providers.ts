import { Provider } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { AuthRepository } from '../domain/repositories/auth.repository';

export function provideAuth(): Provider[] {
  return [{ provide: AuthRepository, useClass: AuthHttpService }];
}
