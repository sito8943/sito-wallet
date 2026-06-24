/** Type guard for a `boolean` value. */
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

/** Type guard for a non-null plain object. */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
