/** Type guard for a finite `number` (excludes NaN/Infinity and non-numbers). */
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Coerces a raw value to a finite number, returning `fallback` for blank
 * strings or values that do not parse to a finite number.
 */
export const parseFiniteNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "string" && value.trim().length === 0) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
