// types
import type { InterestPresetId, InterestPresetValues } from "./types";

// constants
import { INTEREST_PRESETS } from "./constants";

/** Numeric members of a TS numeric enum as `{ key, value }` pairs. */
export const numericEnumEntries = (
  enumObject: Record<string, string | number>,
): { key: string; value: number }[] =>
  Object.entries(enumObject)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([key, value]) => ({ key, value }));

/** Field/value pairs a preset writes into the account form. */
export const getInterestPresetEntries = (
  presetId: InterestPresetId,
): [keyof InterestPresetValues, number][] =>
  Object.entries(INTEREST_PRESETS[presetId]) as [
    keyof InterestPresetValues,
    number,
  ][];
