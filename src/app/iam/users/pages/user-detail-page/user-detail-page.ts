import { Component, input } from '@angular/core';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucidePencil } from '@ng-icons/lucide';
import { User } from '../../types/user-types';

@Component({
  imports: [PageHeader, HlmButtonImports, NgIcon],
  selector: 'sigdosi-user-detail-page',
  styles: ``,
  templateUrl: './user-detail-page.html',
  providers: [provideIcons({ lucideArrowLeft, lucidePencil })],
})
export default class UserDetailPage {
  public readonly user = input.required<User>();
}
