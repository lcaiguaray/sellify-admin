import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideSpartanHlm } from '@ui-spartan/utils';
import { provideCore } from '@core/providers/core.providers';
import { routes } from './app.routes';
import { provideGlobalDomains } from '@core/providers/global-domains.providers';
import { provideCoreInitializers } from '@core/providers/app-initializers.provider';
import { coreInterceptors } from '@core/interceptors/core.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCore(),
    provideGlobalDomains(),

    provideCoreInitializers(),

    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors(coreInterceptors)),

    provideSpartanHlm(),
  ],
};
