import { Provider } from '@angular/core';
import { InventoryRepository } from '../domain/repositories/inventory.repository';
import { InventoryMockService } from './inventory-mock.service';

export function provideInventory(): Provider[] {
  return [{ provide: InventoryRepository, useClass: InventoryMockService }];
}
