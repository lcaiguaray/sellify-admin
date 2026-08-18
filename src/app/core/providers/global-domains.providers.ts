import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAuth, provideRole, provideUser } from '@modules/auth';
import {
  provideBrand,
  provideProduct,
  provideCategory,
  provideUnitMeasure,
  provideUnitConversion,
} from '@modules/catalog';
import { provideInventory } from '@modules/inventory';
import { provideContact } from '@modules/crm/contact';
import { provideLookupGroup, provideLookupValue } from '@modules/core';

export function provideGlobalDomains(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAuth(),
    provideRole(),
    provideUser(),
    provideLookupGroup(),
    provideLookupValue(),
    provideBrand(),
    provideCategory(),
    provideUnitMeasure(),
    provideUnitConversion(),
    provideProduct(),
    provideInventory(),
    provideContact(),
  ]);
}
