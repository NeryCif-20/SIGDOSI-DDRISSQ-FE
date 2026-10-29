import { Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { UserMenu } from '../user-menu/user-menu';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { lucideLogIn } from '@ng-icons/lucide';
import { MainBreadcrumb } from '../main-breadcrumb/main-breadcrumb';
import { ThemeSelector } from '../theme-selector/theme-selector';

@Component({
  imports: [
    HlmSidebarImports,
    HlmSeparatorImports,
    ThemeSelector,
    UserMenu,
    HlmButtonImports,
    RouterLink,
    NgIcon,
    MainBreadcrumb,
  ],
  selector: 'sigdosi-main-header',
  styles: ``,
  templateUrl: './main-header.html',
  providers: [provideIcons({ lucideLogIn })],
})
export class MainHeader {}
