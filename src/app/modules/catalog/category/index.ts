// Domain
export * from './domain/models/category.model';
export { CategoryRepository } from './domain/repositories/category.repository';

// Infrastructure
export * from './infrastructure/dtos/category-api.dto';
export * from './infrastructure/mappers/category.mapper';
export { CategoryMockService } from './infrastructure/category-mock.service';
export { provideCategory } from './infrastructure/providers/category.provider';

// Application
export { CategoryFacade } from './application/facades/category.facade';

// Presentation
export { CATEGORY_ROUTES } from './category.routes';
