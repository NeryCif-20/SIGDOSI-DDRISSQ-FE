import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  imports: [HlmButtonImports, NgIcon, PageHeader],
  selector: 'sigdosi-users-header',
  styles: ``,
  templateUrl: './users-header.html',
  providers: [provideIcons({ lucidePlus })],
})
export class UsersHeader {}
