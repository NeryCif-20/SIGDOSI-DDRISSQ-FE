import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

interface Param<T> {
  parse(raw: string[]): T;
  serialize(value: T): string | string[] | null;
}

export function intParam(defaultValue: number, min = 1, max = Infinity): Param<number> {
  return {
    parse: ([raw]) => {
      return raw != null && /^\d+$/.test(raw) ? Math.min(Math.max(+raw, min), max) : defaultValue;
    },
    serialize: (value) => (value === defaultValue ? null : String(value)),
  };
}

export function stringParam(defaultValue: string): Param<string> {
  return {
    parse: ([raw]) => raw ?? defaultValue,
    serialize: (value) => (value === defaultValue || value === '' ? null : value),
  };
}

export function arrayParam<const T extends readonly string[]>(
  allowedValues?: T,
): Param<T[number][]> {
  return {
    parse: (rawValues) => {
      const unique = [...new Set(rawValues)];

      return (
        allowedValues
          ? unique.filter((value) => allowedValues.includes(value as T[number]))
          : unique
      ).sort() as T[number][];
    },
    serialize: (values) => (values.length ? values : null),
  };
}

export function injectQueryParams<S extends Record<string, unknown>>(schema: {
  [K in keyof S]: Param<S[K]>;
}) {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);
  const queryParams = toSignal(activatedRoute.queryParamMap, {
    requireSync: true,
  });
  const state = computed(() => {
    const params = queryParams();
    const out = {} as S;
    for (const key in schema) {
      out[key] = schema[key].parse(params.getAll(key));
    }
    return out;
  });
  const patch = (values: Partial<S>, options?: { replaceUrl?: boolean }) => {
    const params: Record<string, unknown> = {};
    for (const key in values) {
      params[key] = schema[key].serialize(values[key] as S[typeof key]);
    }
    return router.navigate([], {
      relativeTo: activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: options?.replaceUrl ?? true,
    });
  };
  return {
    state,
    patch,
  };
}
