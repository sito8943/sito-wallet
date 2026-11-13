import { API_KEY_NAME_MAX_LENGTH, toMcpAccess, type AddApiKeyDto } from "lib";

import { API_KEY_PREFIX_SUFFIX } from "./constants";
import type { CreateApiKeyFormType } from "./types";

/** Visible part of a key, e.g. "swal_Ab12Cd…". */
export const formatApiKeyPrefix = (prefix: string): string =>
  `${prefix}${API_KEY_PREFIX_SUFFIX}`;

export const createApiKeyFormToDto = (
  data: CreateApiKeyFormType,
): AddApiKeyDto => ({
  name: data.name.trim(),
  access: toMcpAccess(data.access),
});

/** Translation key of the name error, or null when valid (1..60 chars). */
export const getApiKeyNameErrorKey = (name: unknown): string | null => {
  const value = typeof name === "string" ? name.trim() : "";
  if (!value) return "_pages:aiAgents.keys.dialog.nameRequired";
  if (value.length > API_KEY_NAME_MAX_LENGTH)
    return "_pages:aiAgents.keys.dialog.nameMax";
  return null;
};

/** True when the user cannot create more keys. */
export const isApiKeyLimitReached = (count: number, max: number): boolean =>
  count >= max;
