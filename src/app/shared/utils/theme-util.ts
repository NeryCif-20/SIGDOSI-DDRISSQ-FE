import { THEME_PREFERENCES, ThemePreference } from '../types/theme-types';

export function isValidThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
}
