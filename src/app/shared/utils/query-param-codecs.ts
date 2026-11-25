type Reactive<T> = T | (() => T);

function read<T>(input: Reactive<T>) {
  return typeof input === 'function' ? (input as () => T)() : input;
}

export interface Param<T> {
  parse(raw: string[]): T;
  serialize(decoded: T): string | string[] | null;
}

export interface IntParamOptions {
  min?: Reactive<number | undefined>;
  max?: Reactive<number | undefined>;
}

export function intParam(
  defaultValue: Reactive<number>,
  options: IntParamOptions = {},
): Param<number> {
  const clamp = (value: number) => {
    const min = read(options.min) ?? Number.MIN_SAFE_INTEGER;
    const max = read(options.max) ?? Number.MAX_SAFE_INTEGER;
    return Math.min(Math.max(value, min), max);
  };
  const fallback = read(defaultValue);
  return {
    parse: ([raw]) => {
      const value = raw !== null && raw !== undefined && /^-?\d+$/.test(raw.trim()) ? +raw : NaN;
      return clamp(Number.isSafeInteger(value) ? value : fallback);
    },
    serialize: (decoded) => {
      const value = clamp(decoded);
      return value === clamp(fallback) ? null : String(value);
    },
  };
}

export interface StringParamOptions {
  minLength?: Reactive<number | undefined>;
  maxLength?: Reactive<number | undefined>;
}

export function stringParam(
  defaultValue: Reactive<string>,
  options: StringParamOptions = {},
): Param<string> {
  const clean = (value: string) => {
    const max = read(options.maxLength) ?? 200;
    return value.trim().slice(0, max).trimEnd();
  };
  const isValid = (value: string) => {
    const min = read(options.minLength) ?? 0;
    return value !== '' && value.length >= min;
  };
  const fallback = read(defaultValue);
  return {
    parse: ([raw]) => {
      const cleaned = clean(raw ?? '');
      return isValid(cleaned) ? cleaned : fallback;
    },
    serialize: (decoded) => {
      const cleaned = clean(decoded);
      return !isValid(cleaned) || cleaned === fallback ? null : cleaned;
    },
  };
}

export function arrayParam<const T extends readonly string[] = readonly string[]>(
  allowedValues?: Reactive<T | undefined>,
): Param<T[number][]> {
  let lastList: T | undefined;
  let lastSet: Set<string> | undefined;
  const allowedSet = () => {
    const list = read(allowedValues);
    if (list !== lastList) {
      lastList = list;
      lastSet = list && new Set<string>(list);
    }
    return lastSet;
  };
  const clean = (values: readonly string[]) => {
    const allowed = allowedSet();
    return [
      ...new Set(
        values
          .map((value) => value.trim())
          .filter((value) => value !== '' && (!allowed || allowed.has(value))),
      ),
    ] as T[number][];
  };
  return {
    parse: (raw) => clean(raw),
    serialize: (decoded) => {
      const values = clean(decoded);
      return values.length ? values : null;
    },
  };
}
