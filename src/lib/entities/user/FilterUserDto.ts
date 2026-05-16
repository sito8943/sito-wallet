import type { BaseFilterDto } from "@sito/dashboard-app";

export interface FilterUserDto extends BaseFilterDto {
  username?: string;
  email?: string;
  password?: string;
}
