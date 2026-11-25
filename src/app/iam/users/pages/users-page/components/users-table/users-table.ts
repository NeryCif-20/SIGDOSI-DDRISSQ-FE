import { Component, computed, input, model } from '@angular/core';
import {
  createAppColumnHelper,
  injectAppTable,
  mapArrayStringToSortingState,
  mapSortingStateToArrayString,
} from '../../../../../../shared/utils/table-util';
import { User, UserSortValue } from '../../../../types/user-types';
import {
  flexRenderComponent,
  functionalUpdate,
  SortingState,
  Updater,
  TanStackTableHeader,
  FlexRender,
} from '@tanstack/angular-table';
import { TableSortIndicator } from '../../../../../../shared/components/table-sort-indicator/table-sort-indicator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { CuiPipe } from '../../../../../../shared/pipes/cui-pipe';
import { PhoneNumberPipe } from '../../../../../../shared/pipes/phone-number-pipe';
import { UserAvatar } from '../../../../components/user-avatar/user-avatar';
import { FullNamePipe } from '../../../../pipes/full-name-pipe';
import { UsersOptionsCell } from '../users-options-cell/users-options-cell';
import { UserStatusBadge } from '../../../../components/user-status-badge/user-status-badge';

const fullNamePipe = new FullNamePipe();
const cuiPipe = new CuiPipe();
const phoneNumberPipe = new PhoneNumberPipe();

const columnHelper = createAppColumnHelper<User>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'avatar',
    cell: (info) => {
      const user = info.row.original;
      return flexRenderComponent(UserAvatar, {
        inputs: {
          avatar: user.avatar,
          fallback: fullNamePipe.transform(user),
        },
      });
    },
    size: 100,
  }),
  columnHelper.accessor((user) => fullNamePipe.transform(user), {
    id: 'name',
    header: 'Nombre',
    size: 250,
  }),
  columnHelper.accessor('cui', {
    header: 'CUI',
    cell: (info) => cuiPipe.transform(info.getValue()),
    size: 200,
  }),
  columnHelper.accessor('email', {
    header: 'Correo Electrónico',
    size: 300,
  }),
  columnHelper.accessor('phoneNumber', {
    header: 'Número de Teléfono',
    cell: (info) => phoneNumberPipe.transform(info.getValue()),
    size: 250,
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    size: 150,
    cell: (info) =>
      flexRenderComponent(UserStatusBadge, {
        inputs: {
          status: info.getValue(),
        },
      }),
    enableSorting: false,
  }),
  columnHelper.accessor('role', {
    header: 'Rol',
    enableSorting: false,
    cell: (info) => info.getValue().name,
    size: 250,
  }),
  columnHelper.display({
    id: 'options',
    header: 'Opciones',
    cell: (info) =>
      flexRenderComponent(UsersOptionsCell, {
        inputs: {
          id: info.row.original.id,
        },
      }),
    size: 150,
  }),
]);

@Component({
  imports: [HlmTableImports, TanStackTableHeader, TableSortIndicator, FlexRender],
  selector: 'sigdosi-users-table',
  styles: ``,
  templateUrl: './users-table.html',
})
export class UsersTable {
  public readonly data = input.required<User[]>();
  public readonly sortValues = model.required<UserSortValue[]>();

  public readonly sorting = computed(() => mapArrayStringToSortingState(this.sortValues()));

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
    this.sortValues.set(mapSortingStateToArrayString(next) as UserSortValue[]);
  }
}
