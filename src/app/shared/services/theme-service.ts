import { computed, DestroyRef, DOCUMENT, effect, inject, Service, signal } from '@angular/core';
import { ThemePreference } from '../types/theme-types';

const DARK_THEME_CLASS = 'dark';
const THEME_STORAGE_KEY = 'theme';
const DARK_SCHEMA_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly darkSchemaQuery = window.matchMedia(DARK_SCHEMA_MEDIA_QUERY);

  private readonly _preference = signal(this.readStoredPreference());
  private readonly systemPrefersDarkMode = signal(this.darkSchemaQuery.matches);
  private readonly isDarkMode = computed(() => {
    const preference = this.preference();
    return preference === 'system' ? this.systemPrefersDarkMode() : preference === 'dark';
  });

  public readonly preference = this._preference.asReadonly();

  constructor() {
    this.watchSystemTheme();
    effect(() => {
      this.document.documentElement.classList.toggle(DARK_THEME_CLASS, this.isDarkMode());
    });
    effect(() => {
      this.storePreference(this._preference());
    });
  }

  public setPreference(preference: ThemePreference) {
    this._preference.set(preference);
  }

  private readStoredPreference(): ThemePreference {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return isThemePreference(stored) ? stored : 'system';
    } catch {
      return 'system';
    }
  }

  private storePreference(preference: ThemePreference) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      /* empty */
    }
  }

  private watchSystemTheme(): void {
    const onChange = (event: MediaQueryListEvent) => this.systemPrefersDarkMode.set(event.matches);
    this.darkSchemaQuery.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => this.darkSchemaQuery.removeEventListener('change', onChange));
  }
}
