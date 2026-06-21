import { inject, provideAppInitializer } from '@angular/core';
import { AuthFacade } from '@modules/auth';

export function provideCoreInitializers() {
  return [
    provideAppInitializer(async () => {
      const authFacade = inject(AuthFacade);
      await authFacade.me();
    }),
  ];
}
