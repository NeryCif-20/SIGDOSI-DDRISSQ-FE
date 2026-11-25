import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { RoleData } from '../../types/role-types';
import { RoleApiService } from '../../services/role-api-service';
import { firstValueFrom, map, of } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { PermissionSelector } from '../../../permissions/components/permission-selector/permission-selector';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query';
import { roleKeys, toRoleData } from '../../utils/role-util';

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
  private readonly queryClient = inject(QueryClient);

  private readonly roleId = signal(this.context.roleId);
  private readonly _action = signal(this.context.action);

  private readonly query = injectQuery(() => {
    const id = this.roleId();
    return {
      queryKey: id ? roleKeys.detail(id) : roleKeys.details(),
      queryFn: () =>
        firstValueFrom(
          this._action() === 'create'
            ? of(INITIAL_STATE)
            : this.roleApiService.get(id!).pipe(map((role) => toRoleData(role))),
        ),
      placeholderData: (previousData) => previousData ?? INITIAL_STATE,
    };
  });

  protected readonly saveMutation = injectMutation(() => {
    const action = this._action();
    const id = this.roleId();
    return {
      mutationFn: (data: RoleData) =>
        firstValueFrom(
          action === 'create'
            ? this.roleApiService.create(data)
            : this.roleApiService.update(id!, data),
        ),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes('roles'),
        });
        this.dialogRef.close();
        toast.success(`Rol ${action === 'create' ? 'creado' : 'actualizado'} correctamente`);
      },
    };
  });
  protected readonly deleteMutation = injectMutation(() => ({
    mutationFn: () => firstValueFrom(this.roleApiService.delete(this.roleId()!)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('roles'),
      });
      this.dialogRef.close();
      toast.success('Rol eliminado correctamente');
    },
  }));

  private readonly roleModel = linkedSignal(() => this.query.data() ?? INITIAL_STATE);

  protected readonly header = computed(() => {
    switch (this._action()) {
      case 'delete':
        return {
          title: '¿Estás seguro?',
          description: 'Esta acción no se puede deshacer. Esto eliminará permanentemente el rol.',
        };
      case 'create':
        return {
          title: 'Agrega un rol',
          description: 'Completa los campos del formulario para registrar la información.',
        };
      default:
        return {
          title: 'Actualiza el rol',
          description: 'Edita los campos del formulario para registrar la información.',
        };
    }
  });

  protected readonly action = this._action.asReadonly();

  protected readonly isBusy = computed(() =>
    this._action() === 'delete'
      ? this.deleteMutation.isPending() || this.deleteMutation.isSuccess()
      : this.saveMutation.isPending() || this.saveMutation.isSuccess(),
  );

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
          await this.saveMutation.mutateAsync(form().value());
        },
      },
    },
  );

  protected onSelectedIdsChange(permissions: string[]) {
    this.roleModel.update((value) => ({
      ...value,
      permissions,
    }));
  }
}
