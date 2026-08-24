import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductHttpService } from '../product-http.service';

export function provideProduct(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ProductRepository, useClass: ProductHttpService }]);
}
