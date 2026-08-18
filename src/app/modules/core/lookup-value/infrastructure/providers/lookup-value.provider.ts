import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LookupValueRepository } from '../../domain/repositories/lookup-value.repository';
import { LookupValueHttpService } from '../lookup-value-http.service';

export function provideLookupValue(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: LookupValueRepository, useClass: LookupValueHttpService }]);
}
