import { Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { RoleDialog } from '../../../../components/role-dialog/role-dialog';

@Component({
  imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon],
  selector: 'sigdosi-roles-options-cell',
  styles: ``,
  templateUrl: './roles-options-cell.html',
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideTrash })],
})
export class RolesOptionsCell {
  public readonly id = input.required<string>();

  private readonly dialog = inject(HlmDialogService);

  protected openUpdateDialog() {
    this.dialog.open(RoleDialog, {
      context: {
        action: 'edit',
        roleId: this.id(),
      },
      showCloseButton: false,
    });
  }

  protected openDeleteDialog() {
    this.dialog.open(RoleDialog, {
      context: {
        action: 'delete',
        roleId: this.id(),
      },
      contentClass: 'sm:max-w-sm',
      showCloseButton: false,
    });
  }
}
