import { Page } from '../types/pagination-types';

export function createEmptyPage<E>(page: number, size: number): Page<E> {
  return {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: page - 1,
    size,
    totalElements: 0,
    totalPages: 0,
  };
}
