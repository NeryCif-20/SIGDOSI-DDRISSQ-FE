import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { PermissionApiService } from '../../services/permission-api-service';
import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_ACTION_OPTIONS,
  PermissionAction,
  PermissionData,
} from '../../types/permission-types';
import { firstValueFrom, of } from 'rxjs';
import { form, maxLength, minLength, required, FormRoot, FormField } from '@angular/forms/signals';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import {
  injectMutation,
  injectQuery,
  keepPreviousData,
  QueryClient,
} from '@tanstack/angular-query';

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
  private readonly queryClient = inject(QueryClient);

  private readonly permissionId = signal(this.context.permissionId);
  private readonly _action = signal(this.context.action);

  protected readonly options = PERMISSION_ACTION_OPTIONS;

  private readonly query = injectQuery(() => {
    const id = this.permissionId();
    const action = this._action();
    return {
      queryKey: ['permission', 'dialog', id],
      queryFn: () =>
        firstValueFrom(
          action === 'create' ? of(INITIAL_STATE) : this.permissionApiService.get(id!),
        ),
      initialData: INITIAL_STATE,
      placeholderData: keepPreviousData,
    };
  });

  protected readonly saveMutation = injectMutation(() => {
    const action = this._action();
    return {
      mutationFn: (data: PermissionData) =>
        firstValueFrom(
          action === 'create'
            ? this.permissionApiService.create(data)
            : this.permissionApiService.update(this.permissionId()!, data),
        ),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes('permissions'),
        });
        this.dialogRef.close();
        toast.success(`Permiso ${action === 'create' ? 'creado' : 'actualizado'} correctamente`);
      },
    };
  });
  protected readonly deleteMutation = injectMutation(() => ({
    mutationFn: () => firstValueFrom(this.permissionApiService.delete(this.permissionId()!)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('permissions'),
      });
      this.dialogRef.close();
      toast.success('Permiso eliminado correctamente');
    },
  }));

  private readonly permissionModel = linkedSignal<PermissionData>(() => this.query.data());

  protected readonly header = computed(() => {
    switch (this._action()) {
      case 'delete':
        return {
          title: '¿Estás seguro?',
          description:
            'Esta acción no se puede deshacer. Esto eliminará permanentemente el permiso.',
        };
      case 'create':
        return {
          title: 'Crea un permiso',
          description: 'Completa los campos del formulario para registrar la información.',
        };
      default:
        return {
          title: 'Actualiza el permiso',
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
        action: async (form) => this.saveMutation.mutate(form().value()),
      },
    },
  );

  protected getActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }
}
