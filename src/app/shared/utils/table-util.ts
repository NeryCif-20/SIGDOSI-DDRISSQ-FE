import { WritableSignal } from '@angular/core';
import {
  columnSizingFeature,
  createTableHook,
  functionalUpdate,
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

export function mapSortingStateToArrayString(sorting: SortingState) {
  return sorting.map((value) => `${value.id},${value.desc ? 'desc' : 'asc'}`);
}

export function mapArrayStringToSortingState(queryParams: string[]): SortingState {
  return queryParams.flatMap((value) => {
    const [id, direction] = value.split(',');
    if (!['asc', 'desc'].includes(direction)) {
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

export function createSortingChangeHandler(
  sorting: WritableSignal<SortingState>,
  sortValuesChange: WritableSignal<string[]>,
) {
  return (updater: Updater<SortingState>) => {
    const next = functionalUpdate(updater, sorting());
    sorting.set(next);
    sortValuesChange.set(mapSortingStateToArrayString(next));
  };
}
