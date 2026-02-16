// CHECK LATER
// createEmptyValues now requires defaultValue but several call
// sites (e.g. signup/login form hooks) call it with only fieldNames,
// which will fail typechecking. Either restore a default (e.g. defaultValue = '')
// or update all call sites to pass the intended default value.

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
