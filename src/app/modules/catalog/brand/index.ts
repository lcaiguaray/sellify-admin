// Domain
export * from './domain/models/brand.model';
export { BrandRepository } from './domain/repositories/brand.repository';

// Infrastructure
export * from './infrastructure/dtos/brand-api.dto';
export * from './infrastructure/mappers/brand.mapper';
export { BrandHttpService } from './infrastructure/brand-http.service';
export { provideBrand } from './infrastructure/brand.providers';

// Application
export { BrandFacade } from './application/facades/brand.facade';

// Presentation
export { BRAND_ROUTES } from './brand.routes';
