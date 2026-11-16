import { Component, effect, input, linkedSignal, output } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { FlexRender, flexRenderComponent, TanStackTableHeader } from '@tanstack/angular-table';
import { Permission } from '../../../../types/permission-types';
import { TableSortIndicator } from '../../../../../../shared/components/table-sort-indicator/table-sort-indicator';

import {
  createAppColumnHelper,
  createSignalUpdater,
  injectAppTable,
  mapArrayStringToSortingState,
  mapSortingStateToStringArray,
} from '../../../../../../shared/utils/table-util';
import { PermissionsActionCell } from '../permissions-action-cell/permissions-action-cell';
import { PermissionsOptionsCell } from '../permissions-options-cell/permissions-options-cell';
import { IdBadge } from '../../../../../../shared/components/id-badge/id-badge';

const columnHelper = createAppColumnHelper<Permission>();

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
  columnHelper.accessor('module', {
    header: () => 'Módulo',
    size: 220,
  }),
  columnHelper.accessor('action', {
    header: 'Acción',
    cell: (info) =>
      flexRenderComponent(PermissionsActionCell, {
        inputs: {
          action: info.getValue(),
        },
      }),
    enableSorting: false,
    size: 180,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Opciones',
    cell: (info) =>
      flexRenderComponent(PermissionsOptionsCell, {
        inputs: {
          id: info.row.original.id,
        },
      }),
    enableSorting: false,
    size: 100,
    minSize: 100,
    maxSize: 100,
  }),
]);

@Component({
  imports: [HlmTableImports, FlexRender, TableSortIndicator, TanStackTableHeader],
  selector: 'sigdosi-permissions-table',
  styles: ``,
  templateUrl: './permissions-table.html',
})
export class PermissionsTable {
  public readonly data = input.required<Permission[]>();
  public readonly sortValues = input.required<string[]>();

  public readonly sortValuesChange = output<string[]>();

  private readonly sorting = linkedSignal(() =>
    mapArrayStringToSortingState(this.sortValues(), ['module']),
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
