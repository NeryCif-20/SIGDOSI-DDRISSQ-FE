import { Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { PermissionDialog } from '../../../../components/permission-dialog/permission-dialog';

@Component({
  imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon],
  selector: 'sigdosi-permissions-options-cell',
  styles: ``,
  templateUrl: './permissions-options-cell.html',
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideTrash })],
})
export class PermissionsOptionsCell {
  public readonly id = input.required<string>();

  private readonly dialog = inject(HlmDialogService);

  protected openUpdateDialog() {
    this.dialog.open(PermissionDialog, {
      context: {
        action: 'update',
        permissionId: this.id(),
      },
      contentClass: 'p-4',
      showCloseButton: false,
    });
  }

  protected openDeleteDialog() {
    this.dialog.open(PermissionDialog, {
      context: {
        action: 'delete',
        permissionId: this.id(),
      },
      contentClass: 'sm:max-w-sm p-4',
      showCloseButton: false,
    });
  }
}
