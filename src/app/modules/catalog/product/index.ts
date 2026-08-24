// Domain
export * from './domain/models/product.model';
export { ProductRepository } from './domain/repositories/product.repository';

// Infrastructure
export * from './infrastructure/dtos/product-api.dto';
export * from './infrastructure/mappers/product.mapper';
export { ProductHttpService } from './infrastructure/product-http.service';
export { provideProduct } from './infrastructure/product.providers';

// Application
export { ProductFacade } from './application/facades/product.facade';

// Presentation
export { PRODUCT_ROUTES } from './product.routes';
