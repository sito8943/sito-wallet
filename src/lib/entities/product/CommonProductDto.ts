import type { BaseCommonEntityDto } from "@sito/dashboard-app";

export interface CommonProductDto extends BaseCommonEntityDto {
  name: string;
  /** Name the user knows the product by; `name` is the receipt name. */
  alias?: string | null;
}
