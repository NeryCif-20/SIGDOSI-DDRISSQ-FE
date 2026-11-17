import { Component, effect, input, linkedSignal, output } from '@angular/core';
import {
  createAppColumnHelper,
  createSignalUpdater,
  injectAppTable,
  mapArrayStringToSortingState,
  mapSortingStateToStringArray,
} from '../../../../../../shared/utils/table-util';
import { Role } from '../../../../types/role-types';
import { FlexRender, flexRenderComponent, TanStackTableHeader } from '@tanstack/angular-table';
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
    minSize: 250,
    maxSize: 250,
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
          selected: info.getValue().map((permission) => permission.id),
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
    size: 100,
    minSize: 100,
    maxSize: 100,
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
  public readonly sortValues = input.required<string[]>();

  public readonly sortValuesChange = output<string[]>();

  private readonly sorting = linkedSignal(() =>
    mapArrayStringToSortingState(this.sortValues(), ['name']),
  );

  private readonly sortingChange = createSignalUpdater(this.sorting);

  protected readonly table = injectAppTable(() => ({
    columns,
    data: this.data(),
    manualSorting: true,
    isMultiSortEvent: () => true,
    state: {
      sorting: this.sorting(),
    },
    onSortingChange: this.sortingChange,
  }));

  constructor() {
    effect(() => {
      const sort = mapSortingStateToStringArray(this.sorting());
      this.sortValuesChange.emit(sort);
    });
  }
}
