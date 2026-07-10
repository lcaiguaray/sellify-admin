import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UnitMeasureRepository } from '../../domain/repositories/unit-measure.repository';
import { UnitMeasureMockService } from '../unit-measure-mock.service';

export function provideUnitMeasure(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: UnitMeasureRepository, useClass: UnitMeasureMockService }]);
}
