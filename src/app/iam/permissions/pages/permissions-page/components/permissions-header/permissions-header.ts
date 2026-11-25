import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { PermissionDialog } from '../../../../components/permission-dialog/permission-dialog';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  imports: [HlmButtonImports, NgIcon, PageHeader],
  selector: 'sigdosi-permissions-header',
  styles: ``,
  templateUrl: './permissions-header.html',
  providers: [provideIcons({ lucidePlus })],
})
export class PermissionsHeader {
  private readonly dialog = inject(HlmDialogService);

  protected openCreateDialog() {
    this.dialog.open(PermissionDialog, {
      context: {
        action: 'create',
      },
      showCloseButton: false,
    });
  }
}
