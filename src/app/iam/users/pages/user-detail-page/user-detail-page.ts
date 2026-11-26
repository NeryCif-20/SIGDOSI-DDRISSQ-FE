import { Component, input } from '@angular/core';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleUser,
  lucideCopy,
  lucideIdCard,
  lucideMail,
  lucidePencil,
  lucidePhone,
  lucideShieldUser,
} from '@ng-icons/lucide';
import { User } from '../../types/user-types';
import { UserAvatar } from '../../components/user-avatar/user-avatar';
import { FullNamePipe } from '../../pipes/full-name-pipe';
import { CuiPipe } from '../../../../shared/pipes/cui-pipe';
import { PhoneNumberPipe } from '../../../../shared/pipes/phone-number-pipe';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { IdBadge } from '../../../../shared/components/id-badge/id-badge';
import { UserStatusBadge } from '../../components/user-status-badge/user-status-badge';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { PermissionSelector } from '../../../permissions/components/permission-selector/permission-selector';

@Component({
  imports: [
    PageHeader,
    HlmTypographyImports,
    HlmButtonImports,
    HlmItemImports,
    HlmBadgeImports,
    HlmCardImports,
    HlmSeparatorImports,
    NgIcon,
    UserAvatar,
    FullNamePipe,
    CuiPipe,
    PhoneNumberPipe,
    IdBadge,
    UserStatusBadge,
    PermissionSelector,
  ],
  selector: 'sigdosi-user-detail-page',
  styles: ``,
  templateUrl: './user-detail-page.html',
  providers: [
    provideIcons({
      lucidePencil,
      lucideCircleUser,
      lucideIdCard,
      lucideMail,
      lucidePhone,
      lucideCopy,
      lucideShieldUser,
    }),
  ],
})
export default class UserDetailPage {
  public readonly user = input.required<User>();

  protected copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
  }
}
