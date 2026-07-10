// Domain
export * from './domain/models/inventory.model';
export { InventoryRepository } from './domain/repositories/inventory.repository';

// Infrastructure
export * from './infrastructure/dtos/inventory-api.dto';
export * from './infrastructure/mappers/inventory.mapper';
export { InventoryMockService } from './infrastructure/inventory-mock.service';
export { provideInventory } from './infrastructure/inventory.providers';

// Application
export { InventoryFacade } from './application/facades/inventory.facade';

// Presentation
export { INVENTORY_ITEM_ROUTES } from './inventory-item.routes';
