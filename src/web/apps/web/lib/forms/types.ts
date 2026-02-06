export type FieldErrorsOf<T> = Partial<Record<keyof T, string>>;
export type TouchedOf<T> = Partial<Record<keyof T, boolean>>;
