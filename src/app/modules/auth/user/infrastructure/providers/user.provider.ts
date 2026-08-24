import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserHttpService } from '../user-http.service';

export function provideUser(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: UserRepository, useClass: UserHttpService }]);
}
