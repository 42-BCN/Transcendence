export function createEmptyValues<T extends Record<string, unknown>>(
  fieldNames: readonly (keyof T)[],
  defaultValue: T[keyof T],
): T {
  const result = {} as T;

  for (const k of fieldNames) {
    result[k] = defaultValue;
  }
  return result;
}
