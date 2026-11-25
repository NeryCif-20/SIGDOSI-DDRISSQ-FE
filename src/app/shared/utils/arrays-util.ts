export function toArray<T>(value?: T | T[] | null): T[] {
  return value === null || value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function areEqual(array: unknown[], otherArray: unknown[]) {
  return array.length === otherArray.length && array.every((value) => otherArray.includes(value));
}
