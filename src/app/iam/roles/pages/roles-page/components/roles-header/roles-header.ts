import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { RoleDialog } from '../../../../components/role-dialog/role-dialog';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  imports: [HlmButtonImports, NgIcon, PageHeader],
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
