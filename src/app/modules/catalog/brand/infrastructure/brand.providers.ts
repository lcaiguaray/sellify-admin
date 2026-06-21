import { Provider } from '@angular/core';
import { BrandRepository } from '../domain/repositories/brand.repository';
import { BrandHttpService } from './brand-http.service';

export function provideBrand(): Provider[] {
  return [{ provide: BrandRepository, useClass: BrandHttpService }];
}
