import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductHttpService } from './product-http.service';

export function provideProduct(): Provider[] {
  return [{ provide: ProductRepository, useClass: ProductHttpService }];
}
