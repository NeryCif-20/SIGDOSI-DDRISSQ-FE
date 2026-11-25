import { Component, computed, input, model } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  FlexRender,
  flexRenderComponent,
  functionalUpdate,
  SortingState,
  TanStackTableHeader,
  Updater,
} from '@tanstack/angular-table';
import { Permission, PermissionSortValue } from '../../../../types/permission-types';
import { TableSortIndicator } from '../../../../../../shared/components/table-sort-indicator/table-sort-indicator';

import {
  createAppColumnHelper,
  injectAppTable,
  mapArrayStringToSortingState,
  mapSortingStateToArrayString,
} from '../../../../../../shared/utils/table-util';
import { PermissionsActionCell } from '../permissions-action-cell/permissions-action-cell';
import { PermissionsOptionsCell } from '../permissions-options-cell/permissions-options-cell';
import { IdBadge } from '../../../../../../shared/components/id-badge/id-badge';
import { TitleCasePipe } from '@angular/common';

const titlecase = new TitleCasePipe();

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
  }),
  columnHelper.accessor('module', {
    header: () => 'Módulo',
    cell: (info) => titlecase.transform(info.getValue()),
    size: 250,
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
    size: 200,
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
    size: 150,
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
  public readonly sortValues = model.required<PermissionSortValue[]>();

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
    this.sortValues.set(mapSortingStateToArrayString(next) as PermissionSortValue[]);
  }
}
