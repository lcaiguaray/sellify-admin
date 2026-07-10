import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductMockService } from './product-mock.service';

export function provideProduct(): Provider[] {
  return [{ provide: ProductRepository, useClass: ProductMockService }];
}
