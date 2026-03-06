import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { routes } from './app.routes';
import { provideTheme } from '@app-core/providers/theme';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes),

    // Material
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    provideNativeDateAdapter(),

    // Core
    provideTheme({
      scheme: 'light',
      background: {
        light: '#ffffff',
        dark: '#191d24',
      },
      foreground: {
        light: '#343a40',
        dark: '#fffafa',
      },
      card: {
        light: '#f6f6f7',
        dark: '#27272a',
      },
      palette: {
        primary: '#137268',
        secondary: '#6c757d',
        tertiary: '#f97316',
        success: '#16a34a',
        error: '#dc2626',
      },
    }),
  ],
};
