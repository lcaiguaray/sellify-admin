// Domain
export * from './domain/models/user.model';
export { UserRepository } from './domain/repositories/user.repository';

// Infrastructure
export * from './infrastructure/dtos/user-api.dto';
export * from './infrastructure/mappers/user.mapper';
export { UserHttpService } from './infrastructure/user-http.service';
export { provideUser } from './infrastructure/providers/user.provider';

// Application
export { UserFacade } from './application/facades/user.facade';

// Presentation
export { USER_ROUTES } from './user.routes';
