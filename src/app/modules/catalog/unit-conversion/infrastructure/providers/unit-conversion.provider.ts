import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UnitConversionRepository } from '../../domain/repositories/unit-conversion.repository';
import { UnitConversionMockService } from '../unit-conversion-mock.service';

export function provideUnitConversion(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UnitConversionRepository, useClass: UnitConversionMockService },
  ]);
}
