import type { CardConfigOverrideType } from "./types";

export const resolveCardConfig = (
  config: string | null | undefined,
  configOverride: CardConfigOverrideType | null,
) => {
  if (!configOverride) return config;
  return config === configOverride.baseConfig
    ? configOverride.savedConfig
    : config;
};

/**
 * Reads a card's stored JSON config and maps it to its form values. A
 * malformed config is logged and the card silently falls back to its
 * defaults instead of breaking the dashboard.
 */
export const parseCardConfig = <TStored, TForm>(
  cfg: string | null | undefined,
  fallback: TForm,
  toForm: (stored: TStored) => TForm,
): TForm => {
  try {
    return toForm((cfg ? JSON.parse(cfg) : {}) as TStored);
  } catch (err) {
    console.error(err);
    return fallback;
  }
};
