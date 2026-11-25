import { Component, computed, inject, model } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { QueryClient } from '@tanstack/angular-query';
import { roleKeys } from '../../utils/role-util';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { Page } from '../../../../shared/types/pagination-types';
import { Role } from '../../types/role-types';

@Component({
  imports: [HlmComboboxImports, HlmSpinnerImports],
  selector: 'sigdosi-role-selector',
  styles: ``,
  templateUrl: './role-selector.html',
})
export class RoleSelector {
  public readonly selectedRoles = model.required<string[]>();

  private readonly queryClient = inject(QueryClient);

  protected readonly query = this.queryClient.getQueryData<Page<Role>>(roleKeys.lists());

  protected readonly roles = computed(() =>
    (this.query?.content ?? []).map(({ id: value, name: label }) => ({ value, label })),
  );

  protected readonly getLabel = (value: string) =>
    this.roles().find((role) => role.value === value)?.label ?? value;
}
