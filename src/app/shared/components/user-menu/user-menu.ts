import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideLogOut, lucideUser } from '@ng-icons/lucide';
import { InitialsPipe } from '@spartan-ng/brain/avatar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  imports: [
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
    InitialsPipe,
    HlmBadgeImports,
    NgIcon,
  ],
  selector: 'sigdosi-user-menu',
  styles: ``,
  templateUrl: './user-menu.html',
  providers: [provideIcons({ lucideChevronDown, lucideUser, lucideLogOut })],
})
export class UserMenu {}
