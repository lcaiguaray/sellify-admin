import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { InventoryRepository } from '../../domain/repositories/inventory.repository';
import { InventoryMockService } from '../inventory-mock.service';

export function provideInventory(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: InventoryRepository, useClass: InventoryMockService }]);
}
