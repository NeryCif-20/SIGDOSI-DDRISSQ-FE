import { Component, inject, linkedSignal, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { RoleData } from '../../types/role-types';
import { RoleApiService } from '../../services/role-api-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { finalize, firstValueFrom, map, of } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { PermissionSelector } from '../../../permissions/components/permission-selector/permission-selector';

interface RoleDialogContext {
  action: 'create' | 'edit' | 'delete';
  roleId?: string;
}

const INITIAL_STATE: RoleData = {
  name: '',
  description: '',
  permissions: [],
};

@Component({
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
    HlmTextarea,
    PermissionSelector,
  ],
  selector: 'sigdosi-role-dialog',
  styles: ``,
  templateUrl: './role-dialog.html',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class RoleDialog {
  private readonly context = injectBrnDialogContext<RoleDialogContext>();
  private readonly dialogRef = inject(BrnDialogRef);
  private readonly roleApiService = inject(RoleApiService);

  private readonly roleId = signal(this.context.roleId);
  private readonly _action = signal(this.context.action);
  private readonly _isRequesting = signal(false);

  protected readonly action = this._action.asReadonly();
  protected readonly isRequesting = this._isRequesting.asReadonly();

  protected readonly roleResource = rxResource({
    params: () => ({ id: this.roleId(), action: this._action() }),
    defaultValue: INITIAL_STATE,
    stream: ({ params }) => {
      if (params.action === 'create') {
        return of(INITIAL_STATE);
      }
      return this.roleApiService.get(params.id!).pipe(
        map((role) => {
          const description = role.description === undefined ? '' : role.description;
          const permissions = role.permissions.map((permission) => permission.id);
          return { ...role, description, permissions };
        }),
      );
    },
  });

  private readonly roleModel = linkedSignal(() => this.roleResource.value());

  protected readonly roleForm = form(
    this.roleModel,
    (path) => {
      required(path.name, { message: 'El nombre es obligatorio' });
      minLength(path.name, 1, { message: 'El nombre debe tener al menos un carácer' });
      maxLength(path.name, 30, { message: 'El nombre no debe superar los 30 caracteres' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            const data = form().value();
            const action = this._action();
            await firstValueFrom(
              action === 'create'
                ? this.roleApiService.create(data)
                : this.roleApiService.update(this.roleId()!, data),
            );
            this.dialogRef.close();
            toast.success(`Rol ${action === 'create' ? 'creado' : 'actualizado'} correctamente`);
          } catch {
            return;
          }
        },
      },
    },
  );

  protected onSelectedChange(permissions: string[]) {
    this.roleModel.update((value) => ({
      ...value,
      permissions,
    }));
  }

  protected deleteRole() {
    this._isRequesting.set(true);
    this.roleApiService
      .delete(this.roleId()!)
      .pipe(finalize(() => this._isRequesting.set(false)))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          toast.success('Rol eliminado correctamente');
        },
        error: () => undefined,
      });
  }
}
