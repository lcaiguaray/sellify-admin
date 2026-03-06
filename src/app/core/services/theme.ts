import { DOCUMENT, isPlatformServer } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { THEME_CONFIG } from '@app-core/providers/theme';
import { Breakpoint } from './breakpoint';
import { Scheme, ThemeColors, ThemePalette } from '@app-core/models/theme';
import { LocalStorage } from './local-storage';
import { ColorConfig, generateColorPalette } from '@14ch/color-palette-generator';

@Injectable({ providedIn: 'root' })
export class Theme {
  // Dependencies
  private document = inject(DOCUMENT);
  private isServer = isPlatformServer(inject(PLATFORM_ID));
  private breakpoint = inject(Breakpoint);
  private themeConfig = inject(THEME_CONFIG);
  private localStorage = inject(LocalStorage);

  // State
  private prefersDarkMode = this.breakpoint.match('(prefers-color-scheme: dark)');

  themeColors = signal<ThemeColors>({
    background: this.themeConfig.background,
    foreground: this.themeConfig.foreground,
    card: this.themeConfig.card,
    palette: this.themeConfig.palette,
  });
  scheme = signal<Scheme>(
    (this.localStorage.getItem('scheme') as Scheme) || this.themeConfig.scheme,
  );
  theme = computed<ThemeColors>(() => this.generateTheme(this.themeColors()));

  isDark = computed(
    () => this.scheme() === 'dark' || (this.scheme() === 'system' && this.prefersDarkMode),
  );
  isLight = computed(() => !this.isDark());

  // DOM
  private rootEl = this.document.documentElement;
  private themeStyleEl = this.document.createElement('style');

  constructor() {
    // Append the themeStyleEl to the DOM
    this.themeStyleEl.id = 'theme-colors';
    this.document.head.appendChild(this.themeStyleEl);

    // Update scheme
    effect(() => {
      // Skip the server. Otherwise, the scheme will always be 'system' and
      // the class will always be 'scheme-dark'.
      if (this.isServer) {
        return;
      }

      const scheme = this.scheme();
      const prefersDarkMode = this.prefersDarkMode();

      // Figure out if the scheme is 'dark'
      const isDark = scheme === 'dark' || (scheme === 'system' && prefersDarkMode);

      // Add the 'dark' or 'light' class to the html element
      this.rootEl.classList.toggle('scheme-dark', isDark);
      this.rootEl.classList.toggle('scheme-light', !isDark);

      // Store the scheme in local storage
      this.localStorage.setItem('scheme', scheme);
    });

    // Generate the theme for the first time
    this.generateTheme(this.themeConfig);
  }

  /**
   *  Generates CSS variables for the theme colors and inserts them into the DOM.
   * @param theme
   * @returns
   */
  private generateTheme(theme: ThemeColors): ThemeColors {
    // Obtenemos las variables de las escalas (primary, secondary, etc.)
    const paletteVariables = this.generateVariablesPalette(theme.palette);

    // Agregamos las variables "planas" (background, foreground, card)
    const allVariables: Record<string, string> = {
      ...paletteVariables,
      '--theme-background': `light-dark(${theme.background.light}, ${theme.background.dark})`,
      '--theme-foreground': `light-dark(${theme.foreground.light}, ${theme.foreground.dark})`,
      '--theme-card': `light-dark(${theme.card.light}, ${theme.card.dark})`,
    };

    // Insertamos las variables en el scope :root
    this.themeStyleEl.textContent = `:root { ${Object.entries(allVariables)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`;
    return theme;
  }

  /**
   * Generates CSS variables for a given theme palette by creating color scales
   * for each color and mapping them to CSS variable names.
   * @param themePalette
   * @returns
   */
  private generateVariablesPalette(themePalette: ThemePalette): Record<string, string> {
    // Usamos reduce para construir el objeto final de una sola vez
    return Object.entries(themePalette).reduce(
      (acc, [colorName, seedColor]) => {
        // Generamos la escala para este color específico
        const colorScale = generateColorPalette({
          prefix: 'theme-' + colorName,
          seedColor: seedColor,
          originLevel: 600,
        } as ColorConfig);

        // Mapeamos la escala a variables CSS con nombres limpios
        Object.entries(colorScale).forEach(([shade, hexValue]) => {
          const variableName = shade.startsWith('--') ? shade : `--${shade}`;
          acc[variableName] = hexValue;
        });

        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
