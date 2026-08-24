import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UnitMeasureRepository } from '../../domain/repositories/unit-measure.repository';
import { UnitMeasureHttpService } from '../unit-measure-http.service';

export function provideUnitMeasure(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UnitMeasureRepository, useClass: UnitMeasureHttpService },
  ]);
}
