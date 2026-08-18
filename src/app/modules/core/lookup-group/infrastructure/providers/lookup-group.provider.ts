import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LookupGroupRepository } from '../../domain/repositories/lookup-group.repository';
import { LookupGroupHttpService } from '../lookup-group-http.service';

export function provideLookupGroup(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: LookupGroupRepository, useClass: LookupGroupHttpService }]);
}
