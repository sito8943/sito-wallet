import {
  API_KEY_NAME_MAX_LENGTH,
  MCP_AREA_KEYS,
  hasAllMcpAreas,
  toMcpAccess,
  toMcpAreas,
  type AddApiKeyDto,
  type ApiKeyDto,
  type McpArea,
  type UpdateApiKeyDto,
} from "lib";

import { API_KEY_PREFIX_SUFFIX } from "./constants";
import type { ApiKeyFormType } from "./types";

/** Visible part of a key, e.g. "swal_Ab12Cd…". */
export const formatApiKeyPrefix = (prefix: string): string =>
  `${prefix}${API_KEY_PREFIX_SUFFIX}`;

export const createApiKeyFormToDto = (data: ApiKeyFormType): AddApiKeyDto => ({
  name: data.name.trim(),
  access: toMcpAccess(data.access),
  areas: toMcpAreas(data.areas),
});

/** The stored key as the edit form. */
export const apiKeyDtoToForm = (apiKey: ApiKeyDto): ApiKeyFormType => ({
  id: apiKey.id,
  name: apiKey.name,
  access: toMcpAccess(apiKey.access),
  areas: toMcpAreas(apiKey.areas),
});

export const apiKeyFormToUpdateDto = (
  data: ApiKeyFormType,
  apiKey?: ApiKeyDto,
): UpdateApiKeyDto => ({
  id: data.id ?? apiKey?.id ?? 0,
  name: data.name.trim(),
  access: toMcpAccess(data.access),
  areas: toMcpAreas(data.areas),
});

/** Translation key of the areas error, or null when at least one is picked. */
export const getApiKeyAreasErrorKey = (areas: unknown): string | null =>
  Array.isArray(areas) && areas.length > 0
    ? null
    : "_pages:aiAgents.areas.required";

/**
 * Translation keys of a key's areas for its list item, or null when it has
 * them all (nothing worth showing).
 */
export const getApiKeyAreaLabelKeys = (
  areas: readonly McpArea[],
): string[] | null =>
  hasAllMcpAreas(areas)
    ? null
    : areas.map(
        (area) => `_pages:aiAgents.areas.items.${MCP_AREA_KEYS[area]}.label`,
      );

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
