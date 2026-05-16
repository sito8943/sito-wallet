import type { ImportPreviewDto } from "@sito/dashboard-app";

export interface ImportPreviewUserDto extends ImportPreviewDto {
  email: string;
  username?: string;
  admin?: boolean;
}
