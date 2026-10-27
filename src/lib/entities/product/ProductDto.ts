import type { BaseEntityDto } from "@sito/dashboard-app";

export interface ProductDto extends BaseEntityDto {
  name: string;
  alias?: string | null;
}
