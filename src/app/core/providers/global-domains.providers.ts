import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAuth } from '@modules/auth';
import { provideBrand } from '@modules/catalog';

export function provideGlobalDomains(): EnvironmentProviders {
  return makeEnvironmentProviders([provideAuth(), provideBrand()]);
}
