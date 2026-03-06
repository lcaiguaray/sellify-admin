import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { ThemeConfig } from '@app-core/models/theme';
import { Theme } from '@app-core/services/theme';

export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');

export const provideTheme = (config: ThemeConfig): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: THEME_CONFIG,
      useValue: config,
    },

    // Initialize the Theme
    provideAppInitializer(() => {
      inject(Theme);
    }),
  ]);
