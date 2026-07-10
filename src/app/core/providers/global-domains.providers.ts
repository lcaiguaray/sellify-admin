import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAuth } from '@modules/auth';
import { provideBrand, provideProduct, provideCategory, provideUnitMeasure, provideUnitConversion } from '@modules/catalog';
import { provideInventory } from '@modules/inventory';
import { provideContact } from '@modules/crm/contact';

export function provideGlobalDomains(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAuth(),
    provideBrand(),
    provideCategory(),
    provideUnitMeasure(),
    provideUnitConversion(),
    provideProduct(),
    provideInventory(),
    provideContact(),
  ]);
}
