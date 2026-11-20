import { Component, computed, inject, model } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { injectQuery } from '@tanstack/angular-query';
import { RoleApiService } from '../../services/role-api-service';
import { roleKeys } from '../../utils/role-util';
import { firstValueFrom } from 'rxjs';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  imports: [HlmComboboxImports, HlmSpinnerImports],
  selector: 'sigdosi-role-selector',
  styles: ``,
  templateUrl: './role-selector.html',
})
export class RoleSelector {
  public readonly selectedRoles = model.required<string[]>();
  private readonly roleApiService = inject(RoleApiService);

  protected readonly query = injectQuery(() => {
    return {
      queryKey: roleKeys.lists(),
      queryFn: () => firstValueFrom(this.roleApiService.getAll()),
    };
  });

  protected readonly roles = computed(() =>
    (this.query.data()?.content ?? []).map(({ id: value, name: label }) => ({ value, label })),
  );

  protected readonly getLabel = (value: string) =>
    this.roles().find((role) => role.value === value)?.label ?? value;
}
