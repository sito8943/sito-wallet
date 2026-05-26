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
