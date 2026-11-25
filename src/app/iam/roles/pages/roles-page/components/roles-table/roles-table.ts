import { Component, computed, input, model } from '@angular/core';
import {
  createAppColumnHelper,
  injectAppTable,
  mapArrayStringToSortingState,
  mapSortingStateToArrayString,
} from '../../../../../../shared/utils/table-util';
import { Role, RoleSortValue } from '../../../../types/role-types';
import {
  FlexRender,
  flexRenderComponent,
  functionalUpdate,
  SortingState,
  TanStackTableHeader,
  Updater,
} from '@tanstack/angular-table';
import { IdBadge } from '../../../../../../shared/components/id-badge/id-badge';
import { PermissionSelector } from '../../../../../permissions/components/permission-selector/permission-selector';
import { TableSortIndicator } from '../../../../../../shared/components/table-sort-indicator/table-sort-indicator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { RolesOptionsCell } from '../roles-options-cell/roles-options-cell';

const columnHelper = createAppColumnHelper<Role>();

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
    enableSorting: false,
    cell: (info) =>
      flexRenderComponent(IdBadge, {
        inputs: {
          id: info.getValue(),
        },
      }),
    size: 250,
  }),
  columnHelper.accessor('name', {
    header: () => 'Nombre',
    size: 250,
  }),
  columnHelper.accessor('permissions', {
    header: 'Permisos',
    enableSorting: false,
    cell: (info) =>
      flexRenderComponent(PermissionSelector, {
        inputs: {
          readonly: true,
          selectedIds: info.getValue().map((permission) => permission.id),
          closeButtonText: 'Cerrar',
        },
      }),
    size: 180,
  }),
  columnHelper.display({
    id: 'options',
    header: 'Opciones',
    enableSorting: false,
    cell: (info) =>
      flexRenderComponent(RolesOptionsCell, {
        inputs: {
          id: info.row.original.id,
        },
      }),
    size: 150,
  }),
]);

@Component({
  imports: [HlmTableImports, TanStackTableHeader, TableSortIndicator, FlexRender],
  selector: 'sigdosi-roles-table',
  styles: ``,
  templateUrl: './roles-table.html',
})
export class RolesTable {
  public readonly data = input.required<Role[]>();
  public readonly sortValues = model.required<RoleSortValue[]>();

  private readonly sorting = computed(() => mapArrayStringToSortingState(this.sortValues()));

  protected readonly table = injectAppTable(() => ({
    columns,
    data: this.data(),
    manualSorting: true,
    isMultiSortEvent: () => true,
    state: {
      sorting: this.sorting(),
    },
    onSortingChange: this.onSortingChange,
  }));

  private onSortingChange(updater: Updater<SortingState>) {
    const next = functionalUpdate(updater, this.sorting());
    this.sortValues.set(mapSortingStateToArrayString(next) as RoleSortValue[]);
  }
}
