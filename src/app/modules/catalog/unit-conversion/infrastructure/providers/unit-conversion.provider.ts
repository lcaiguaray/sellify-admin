import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UnitConversionRepository } from '../../domain/repositories/unit-conversion.repository';
import { UnitConversionHttpService } from '../unit-conversion-http.service';

export function provideUnitConversion(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UnitConversionRepository, useClass: UnitConversionHttpService },
  ]);
}
