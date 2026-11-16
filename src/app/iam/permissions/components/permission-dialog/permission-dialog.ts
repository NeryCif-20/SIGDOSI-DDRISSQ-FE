import { Component, inject, linkedSignal, signal } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { PermissionApiService } from '../../services/permission-api-service';
import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_ACTION_OPTIONS,
  PermissionAction,
  PermissionData,
} from '../../types/permission-types';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, of } from 'rxjs';
import { form, maxLength, minLength, required, FormRoot, FormField } from '@angular/forms/signals';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

interface PermissionDialogContext {
  action: 'create' | 'edit' | 'delete';
  permissionId?: string;
}

const INITIAL_STATE: PermissionData = {
  module: '',
  action: '',
};

@Component({
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    HlmComboboxImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
  ],
  selector: 'sigdosi-permission-dialog',
  styles: ``,
  templateUrl: './permission-dialog.html',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class PermissionDialog {
  private readonly context = injectBrnDialogContext<PermissionDialogContext>();
  private readonly dialogRef = inject(BrnDialogRef);
  private readonly permissionApiService = inject(PermissionApiService);

  private readonly permissionId = signal(this.context.permissionId);
  private readonly _action = signal(this.context.action);
  private readonly _isRequesting = signal(false);

  protected readonly options = PERMISSION_ACTION_OPTIONS;

  protected readonly action = this._action.asReadonly();
  protected readonly isRequesting = this._isRequesting.asReadonly();

  protected readonly permissionResource = rxResource({
    params: () => ({
      action: this.action(),
      id: this.permissionId(),
    }),
    defaultValue: INITIAL_STATE,
    stream: ({ params }) => {
      if (params.action === 'create') {
        return of(INITIAL_STATE);
      }
      return this.permissionApiService.get(params.id!);
    },
  });

  private readonly permissionModel = linkedSignal<PermissionData>(() =>
    this.permissionResource.value(),
  );

  protected readonly permissionForm = form(
    this.permissionModel,
    (path) => {
      required(path.module, { message: 'El módulo es obligatorio' });
      minLength(path.module, 1, { message: 'El módulo debe tener al menos un carácter' });
      maxLength(path.action, 20, { message: 'El módulo no debe superar los 20 caracteres' });
      required(path.action, { message: 'La acción es obligatoria' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            const data = form().value();
            const action = this.action();
            await firstValueFrom(
              action === 'create'
                ? this.permissionApiService.create(data)
                : this.permissionApiService.update(this.permissionId()!, data),
            );
            this.dialogRef.close();
            toast.success(
              `Permiso ${action === 'create' ? 'creado' : 'actualizado'} correctamente`,
            );
          } catch {
            return;
          }
        },
      },
    },
  );

  protected getActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }

  protected deletePermission() {
    this._isRequesting.set(true);
    this.permissionApiService.delete(this.permissionId()!).subscribe({
      next: () => {
        this.dialogRef.close();
        toast.success('Permiso eliminado correctamente');
      },
      error: () => undefined,
      complete: () => this._isRequesting.set(false),
    });
  }
}
