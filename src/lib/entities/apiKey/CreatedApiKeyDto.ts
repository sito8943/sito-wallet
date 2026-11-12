import type { ApiKeyDto } from "./ApiKeyDto";

/** Response of a key creation: the only time the full secret is returned. */
export interface CreatedApiKeyDto extends ApiKeyDto {
  key: string;
}
