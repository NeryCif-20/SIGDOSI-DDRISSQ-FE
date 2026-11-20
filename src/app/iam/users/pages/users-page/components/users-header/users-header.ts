import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
  imports: [HlmTypographyImports, HlmBadgeImports, HlmButtonImports, NgIcon],
  selector: 'sigdosi-users-header',
  styles: ``,
  templateUrl: './users-header.html',
  providers: [provideIcons({ lucidePlus })],
})
export class UsersHeader {}
