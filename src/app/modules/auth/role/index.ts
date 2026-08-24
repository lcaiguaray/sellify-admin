// Domain
export * from './domain/models/role.model';
export { RoleRepository } from './domain/repositories/role.repository';

// Infrastructure
export * from './infrastructure/dtos/role-api.dto';
export * from './infrastructure/mappers/role.mapper';
export { RoleHttpService } from './infrastructure/role-http.service';
export { provideRole } from './infrastructure/providers/role.provider';

// Application
export { RoleFacade } from './application/facades/role.facade';

// Presentation
export { ROLE_ROUTES } from './role.routes';
