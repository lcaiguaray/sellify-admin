import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryMockService } from '../category-mock.service';

export function provideCategory(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: CategoryRepository, useClass: CategoryMockService }]);
}
