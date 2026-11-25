import { computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { areEqual, toArray } from './arrays-util';
import { Param } from './query-param-codecs';

export function injectQueryParams<S extends Record<string, unknown>>(
  schema: {
    [K in keyof S]: Param<S[K]>;
  },
  options: { normalize: boolean; removeUnknown: boolean } = {
    normalize: true,
    removeUnknown: false,
  },
) {
  const router = inject(Router);
  const activatedRoute = router.routerState.root;
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
  const navigate = (params: Record<string, unknown>, replaceUrl = true) =>
    router.navigate([], {
      relativeTo: activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  const patch = (values: Partial<S>, options?: { replaceUrl?: boolean }) => {
    const params: Record<string, unknown> = {};
    for (const key in values) {
      if (values[key] === undefined) {
        continue;
      }
      params[key] = schema[key].serialize(values[key] as S[typeof key]);
    }
    return navigate(params, options?.replaceUrl);
  };
  effect(() => {
    if (!options.normalize) {
      return;
    }
    const params = queryParams();
    const parsed = state();
    const out: Record<string, unknown> = {};
    for (const key in schema) {
      const serialized = schema[key].serialize(parsed[key]);
      if (!areEqual(params.getAll(key), toArray(serialized))) {
        out[key] = serialized;
      }
    }
    if (options.removeUnknown) {
      for (const key of params.keys) {
        if (!(key in schema)) {
          out[key] = null;
        }
      }
    }
    if (Object.keys(out).length) {
      navigate(out);
    }
  });
  return {
    state,
    patch,
  };
}
