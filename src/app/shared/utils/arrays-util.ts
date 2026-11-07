export function groupBy<T, K extends PropertyKey>(items: readonly T[], getKey: (item: T) => K) {
  return items.reduce(
    (groups, item) => {
      const key = getKey(item);
      (groups[key] ??= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}
