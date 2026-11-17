import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { RoleDialog } from '../../../../components/role-dialog/role-dialog';

@Component({
  imports: [HlmTypographyImports, HlmBadgeImports, HlmButtonImports, NgIcon],
  selector: 'sigdosi-roles-header',
  styles: ``,
  templateUrl: './roles-header.html',
  providers: [provideIcons({ lucidePlus })],
})
export class RolesHeader {
  private readonly dialog = inject(HlmDialogService);

  protected openCreateDialog() {
    this.dialog.open(RoleDialog, {
      context: {
        action: 'create',
      },
      showCloseButton: false,
    });
  }
}
