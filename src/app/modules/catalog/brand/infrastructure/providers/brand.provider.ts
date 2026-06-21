import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandHttpService } from '../brand-http.service';

export function provideBrand(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: BrandRepository, useClass: BrandHttpService }]);
}
