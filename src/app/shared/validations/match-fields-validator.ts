import { SchemaPath, validate } from '@angular/forms/signals';

export function matchFields<T>(
  path: SchemaPath<T>,
  otherPath: SchemaPath<T>,
  options?: { message?: string },
): void {
  validate(path, ({ value, valueOf }) => {
    if (value() !== valueOf(otherPath)) {
      return {
        kind: 'fieldsMismatch',
        message: options?.message || 'Fields do not match',
      };
    }
    return null;
  });
}
