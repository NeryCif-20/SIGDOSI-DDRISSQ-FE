import { WritableSignal } from '@angular/core';
import {
  columnSizingFeature,
  createTableHook,
  rowSortingFeature,
  SortingState,
  tableFeatures,
  Updater,
} from '@tanstack/angular-table';

const features = tableFeatures({
  rowSortingFeature,
  columnSizingFeature,
});

export const { injectAppTable, createAppColumnHelper } = createTableHook({
  features,
});

export function createSignalUpdater<T>(state: WritableSignal<T>) {
  return (updater: Updater<T>) => {
    state.update((current) =>
      typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater,
    );
  };
}

export function mapSortingStateToStringArray(sorting: SortingState) {
  return sorting.map((value) => `${value.id},${value.desc ? 'desc' : 'asc'}`);
}

export function mapArrayStringToSortingState(
  queryParams: string[],
  sortColumns: string[],
): SortingState {
  return queryParams.flatMap((value) => {
    const [id, direction] = value.split(',');
    if (!sortColumns.includes(id) || !['asc', 'desc'].includes(direction)) {
      return [];
    }
    return [
      {
        id,
        desc: direction === 'desc',
      },
    ];
  });
}
