import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleHttpService } from '../role-http.service';

export function provideRole(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: RoleRepository, useClass: RoleHttpService }]);
}
