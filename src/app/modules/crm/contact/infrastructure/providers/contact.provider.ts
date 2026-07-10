import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ContactRepository } from '../../domain/repositories/contact.repository';
import { ContactMockService } from '../contact-mock.service';

export function provideContact(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ContactRepository, useClass: ContactMockService }
  ]);
}
