import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon, lucideSunMoon } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { ThemePreference } from '../../types/theme-types';
import { ThemeService } from '../../services/theme-service';

interface ThemeDisplay {
  label: string;
  icon: string;
}

interface ThemeOption extends ThemeDisplay {
  value: ThemePreference;
}

const THEME_DISPLAY_MAP: Record<ThemePreference, ThemeDisplay> = {
  light: { label: 'Claro', icon: 'lucideSun' },
  dark: { label: 'Oscuro', icon: 'lucideMoon' },
  system: { label: 'Sistema', icon: 'lucideSunMoon' },
};

const THEME_OPTIONS: ThemeOption[] = (
  Object.entries(THEME_DISPLAY_MAP) as [ThemePreference, ThemeDisplay][]
).map(([value, display]) => ({
  value,
  ...display,
}));

@Component({
  imports: [HlmButtonImports, HlmTooltipImports, NgIcon, HlmDropdownMenuImports],
  selector: 'sigdosi-theme-selector',
  styles: ``,
  templateUrl: './theme-selector.html',
  providers: [
    provideIcons({
      lucideSun,
      lucideMoon,
      lucideSunMoon,
    }),
  ],
})
export class ThemeSelector {
  protected readonly themeService = inject(ThemeService);

  protected readonly currentOption = computed<ThemeOption>(() => {
    const value = this.themeService.preference();
    return {
      value,
      ...THEME_DISPLAY_MAP[value],
    };
  });
  protected readonly options = THEME_OPTIONS;
}
