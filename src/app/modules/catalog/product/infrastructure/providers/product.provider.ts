import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductMockService } from '../product-mock.service';

export function provideProduct(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ProductRepository, useClass: ProductMockService }]);
}
