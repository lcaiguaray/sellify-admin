export type Scheme = 'light' | 'dark' | 'system';

export type ColorModeValues = {
  light: string;
  dark: string;
};

export type ThemePalette = {
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  error: string;
};

export type ThemeColors = {
  background: ColorModeValues;
  foreground: ColorModeValues;
  card: ColorModeValues;
  palette: ThemePalette;
};

export type ThemeConfig = ThemeColors & Record<'scheme', Scheme>;
