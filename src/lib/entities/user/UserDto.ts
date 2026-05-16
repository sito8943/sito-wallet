import type { BaseEntityDto } from "@sito/dashboard-app";

export interface UserDto extends BaseEntityDto {
  username: string;
  email: string;
  admin: boolean;
}
