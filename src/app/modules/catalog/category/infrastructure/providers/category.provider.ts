import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryHttpService } from '../category-http.service';

export function provideCategory(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: CategoryRepository, useClass: CategoryHttpService }]);
}
