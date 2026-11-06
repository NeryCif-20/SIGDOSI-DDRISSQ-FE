import { Component, computed, inject } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { lucideLogIn } from '@ng-icons/lucide';
import { MainBreadcrumb } from '../main-breadcrumb/main-breadcrumb';
import { ThemeSelector } from '../../../../components/theme-selector/theme-selector';
import { AuthService } from '../../../../../iam/auth/services/auth-service';
import { MainUserMenu } from '../main-user-menu/main-user-menu';

@Component({
  imports: [
    HlmSidebarImports,
    HlmSeparatorImports,
    HlmButtonImports,
    RouterLink,
    NgIcon,
    MainBreadcrumb,
    ThemeSelector,
    MainUserMenu,
  ],
  selector: 'sigdosi-main-header',
  styles: ``,
  templateUrl: './main-header.html',
  providers: [provideIcons({ lucideLogIn })],
})
export class MainHeader {
  private readonly authService = inject(AuthService);

  protected readonly isAuthenticated = computed(
    () => this.authService.status() === 'AUTHENTICATED',
  );
}
